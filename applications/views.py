from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Application, Profile
from .serializer import ApplicationSerializer, ProfileSerializer


# -----------------------------
# Application API
# -----------------------------

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# -----------------------------
# Register API
# -----------------------------

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not username or not email or not password:
        return Response(
            {
                "error": "Username, email and password are required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {
                "error": "Username already exists."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {
                "error": "Email already exists."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    token, created = Token.objects.get_or_create(user=user)

    return Response(
        {
            "message": "Registration successful.",
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        },
        status=status.HTTP_201_CREATED
    )


# -----------------------------
# Login API
# -----------------------------

@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {
                "error": "Username and password are required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(
        username=username,
        password=password
    )

    if user is None:
        return Response(
            {
                "error": "Invalid username or password."
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    token, created = Token.objects.get_or_create(user=user)

    return Response(
        {
            "message": "Login successful.",
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        },
        status=status.HTTP_200_OK
    )


# -----------------------------
# Logout API
# -----------------------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()

    return Response(
        {
            "message": "Logout successful."
        },
        status=status.HTTP_200_OK
    )


# -----------------------------
# Current User API
# -----------------------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    return Response(
        {
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email
        },
        status=status.HTTP_200_OK
    )


# -----------------------------
# Change Password API
# -----------------------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    current_password = request.data.get("current_password")
    new_password = request.data.get("new_password")

    if not current_password or not new_password:
        return Response(
            {
                "error": "Current password and new password are required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(
        username=request.user.username,
        password=current_password
    )

    if user is None:
        return Response(
            {
                "error": "Current password is incorrect."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(new_password) < 8:
        return Response(
            {
                "error": "New password must be at least 8 characters."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    request.user.set_password(new_password)
    request.user.save()

    return Response(
        {
            "message": "Password changed successfully."
        },
        status=status.HTTP_200_OK
    )

# -----------------------------
# Profile API
# -----------------------------

@api_view(["GET", "PUT", "PATCH"])
@permission_classes([IsAuthenticated])
def profile(request):

    profile, created = Profile.objects.get_or_create(
        user=request.user
    )

    if request.method == "GET":
        serializer = ProfileSerializer(
            profile,
            context={"request": request}
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    serializer = ProfileSerializer(
        profile,
        data=request.data,
        partial=True,
        context={"request": request}
    )

    if serializer.is_valid():
        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )