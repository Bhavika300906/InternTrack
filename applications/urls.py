from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    ApplicationViewSet,
    register,
    login,
    logout,
    current_user,
    change_password,
    profile,
)


router = DefaultRouter()

router.register(
    r'applications',
    ApplicationViewSet,
    basename='application'
)


urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('user/', current_user, name='current-user'),
    path('change-password/', change_password, name='change-password'),
    path('profile/', profile, name='profile'),
]


urlpatterns += router.urls