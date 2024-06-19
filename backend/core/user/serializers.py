from rest_framework import serializers

from core.user.models import User
from core.abstract.serializers import AbstractSerializer

class UserSerializer(AbstractSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'is_active', 'created_at', 'updated_at']
        read_only_field = ['is_active']