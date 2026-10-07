from django.db import models
from django.contrib.auth.models import User


# -----------------------------
# Application Model
# -----------------------------

class Application(models.Model):

    STATUS_CHOICES = [
        ('Applied', 'Applied'),
        ('Interview', 'Interview'),
        ('Offer', 'Offer'),
        ('Rejected', 'Rejected'),
    ]

    JOB_TYPE_CHOICES = [
        ('Internship', 'Internship'),
        ('Full Time', 'Full Time'),
        ('Part Time', 'Part Time'),
        ('Freelance', 'Freelance'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    company = models.CharField(max_length=150)

    position = models.CharField(max_length=150)

    location = models.CharField(max_length=150)

    job_type = models.CharField(
        max_length=20,
        choices=JOB_TYPE_CHOICES,
        default='Internship'
    )

    applied_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Applied'
    )

    job_url = models.URLField(
        blank=True,
        null=True
    )

    notes = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.company} - {self.position}"


# -----------------------------
# Profile Model
# -----------------------------

class Profile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    name = models.CharField(
        max_length=150,
        blank=True
    )

    profile_picture = models.ImageField(
        upload_to="profile_pictures/",
        blank=True,
        null=True
    )

    def __str__(self):
        return self.user.username