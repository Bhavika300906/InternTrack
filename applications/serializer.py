from rest_framework import serializers

from .models import Application, Profile


# -----------------------------
# Application Serializer
# -----------------------------

class ApplicationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Application

        fields = [
            'id',
            'user',
            'company',
            'position',
            'location',
            'job_type',
            'applied_date',
            'status',
            'job_url',
            'notes',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'id',
            'user',
            'created_at',
            'updated_at',
        ]


# -----------------------------
# Profile Serializer
# -----------------------------

class ProfileSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source='user.username',
        read_only=True
    )

    email = serializers.EmailField(
        source='user.email',
        read_only=True
    )

    profile_picture = serializers.ImageField(
        required=False,
        allow_null=True
    )

    class Meta:
        model = Profile

        fields = [
            'id',
            'username',
            'email',
            'name',
            'profile_picture',
        ]

        read_only_fields = [
            'id',
            'username',
            'email',
        ]