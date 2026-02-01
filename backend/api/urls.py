from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, 
    UserProfileView, 
    HostelViewSet, 
    BookingViewSet,
    MyBookingView
)

router = DefaultRouter()
router.register(r'hostels', HostelViewSet, basename='hostel')
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/profile/', UserProfileView.as_view(), name='profile'),
    path('bookings/my/', MyBookingView.as_view(), name='my-booking'),
    path('', include(router.urls)),
]
