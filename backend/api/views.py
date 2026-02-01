from rest_framework import generics, viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Hostel, Booking
from .serializers import (
    UserSerializer, 
    RegisterSerializer, 
    HostelSerializer, 
    BookingSerializer
)

class IsAdminOrOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are allowed to staff and owners (authenticated)
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # Staff can edit anything
        if request.user.is_staff:
            return True
        # Owners can only edit their own hostels
        if hasattr(request.user, 'profile') and request.user.profile.role == 'OWNER':
            return obj.owner == request.user
        return False

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class UserProfileView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class HostelViewSet(viewsets.ModelViewSet):
    queryset = Hostel.objects.all()
    serializer_class = HostelSerializer
    permission_classes = (IsAdminOrOwnerOrReadOnly,)

    def perform_create(self, serializer):
        # Assign current user as owner if they are an OWNER role, or if admin
        if hasattr(self.request.user, 'profile') and self.request.user.profile.role == 'OWNER':
            serializer.save(owner=self.request.user)
        else:
            serializer.save() # Admin can create, owner will be null unless specified or Logic added

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Booking.objects.all()
        
        # Owners can see bookings for their hostels
        if hasattr(user, 'profile') and user.profile.role == 'OWNER':
            return Booking.objects.filter(hostel__owner=user)
            
        # Students see their own bookings
        return Booking.objects.filter(student=user)

    def perform_create(self, serializer):
        hostel = serializer.validated_data['hostel']
        hostel.available_rooms -= 1
        hostel.save()
        serializer.save(student=self.request.user)

    def destroy(self, request, *args, **kwargs):
        booking = self.get_object()
        
        # Allow cleanup if booking is deleted
        if request.user.is_staff or (hasattr(request.user, 'profile') and request.user.profile.role == 'OWNER' and booking.hostel.owner == request.user) or booking.student == request.user:
            hostel = booking.hostel
            hostel.available_rooms += 1
            hostel.save()
            return super().destroy(request, *args, **kwargs)
        
        return Response(status=status.HTTP_403_FORBIDDEN)

class MyBookingView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        try:
            booking = Booking.objects.get(student=request.user)
            serializer = BookingSerializer(booking)
            return Response(serializer.data)
        except Booking.DoesNotExist:
            return Response({"detail": "No booking found"}, status=status.HTTP_404_NOT_FOUND)
