from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('STUDENT', 'Student'),
        ('OWNER', 'Hostel Owner'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='STUDENT')

    def __str__(self):
        return f"{self.user.username} - {self.role}"

class Hostel(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hostels', null=True, blank=True)
    name = models.CharField(max_length=255)
    university_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    total_rooms = models.PositiveIntegerField()
    available_rooms = models.PositiveIntegerField()
    price_per_month = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    services = models.TextField(blank=True, help_text="Comma-separated services, e.g., WiFi, Laundry, AC")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.university_name})"  

class Booking(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
    )
    
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE, related_name='bookings')
    booking_date = models.DateTimeField(auto_now_add=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['student'], name='unique_student_booking')
        ]

    def __str__(self):
        return f"{self.student.username} - {self.hostel.name}"
