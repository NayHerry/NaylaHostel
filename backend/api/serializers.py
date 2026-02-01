from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Hostel, Booking, UserProfile

class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='profile.role', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_staff', 'role')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True, required=False, default='STUDENT')

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role')

    def create(self, validated_data):
        role = validated_data.pop('role', 'STUDENT')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        UserProfile.objects.create(user=user, role=role)
        return user

class HostelSerializer(serializers.ModelSerializer):
    owner_name = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Hostel
        fields = '__all__'
        read_only_fields = ('owner',)

class BookingSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.username')
    hostel_name = serializers.ReadOnlyField(source='hostel.name')

    class Meta:
        model = Booking
        fields = ('id', 'student', 'hostel', 'student_name', 'hostel_name', 'booking_date', 'start_date', 'end_date', 'status')
        read_only_fields = ('student',)

    def validate(self, data):
        user = self.context['request'].user
        
        # Prevent students from changing status
        if 'status' in data and not user.is_staff:
            # Check if user is an owner of this hostel
            booking_instance = self.instance
            if booking_instance and booking_instance.hostel.owner == user:
                 pass # Owner can update status
            elif booking_instance and data['status'] != booking_instance.status:
                raise serializers.ValidationError("Only admins or hostel owners can change the booking status.")
            elif not booking_instance and data['status'] != 'PENDING':
                data['status'] = 'PENDING' # Force pending for new bookings

        # Check if student already has a booking (only on creation)
        if not self.instance and Booking.objects.filter(student=user).exists():
            raise serializers.ValidationError("You have already booked a hostel.")
            
        hostel = data.get('hostel')
        if hostel:
            if hostel.available_rooms <= 0:
                # If updating and hostel is same, it's fine (already occupies a room)
                if self.instance and self.instance.hostel == hostel:
                    pass
                else:
                    raise serializers.ValidationError("This hostel has no rooms available.")
            
        return data
