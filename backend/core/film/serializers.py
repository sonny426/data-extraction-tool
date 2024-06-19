from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.abstract.serializers import AbstractSerializer
from core.film.models import Film

class FilmSerializer(AbstractSerializer):

    class Meta:
        model = Film
        fields = ['id', 'title', 'studio', 'genre', 'arena', 'modified_at', 'season', 'status', 'link', 'created_at', 'updated_at']