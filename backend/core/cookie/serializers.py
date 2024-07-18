from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.abstract.serializers import AbstractSerializer
from core.cookie.models import Cookie

class CookieSerializer(AbstractSerializer):

    class Meta:
        model = Cookie
        fields = ['id', 'cookie']