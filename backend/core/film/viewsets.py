from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response

from core.abstract.viewsets import AbstractViewSet
from core.film.models import Film
from core.film.serializers import FilmSerializer

class FilmViewSet(AbstractViewSet):
    http_method_names = ('post', 'get')
    permission_classes = (AllowAny,)
    serializer_class = FilmSerializer

    def get_queryset(self):
        return Film.objects.all()

    def get_object(self):
        return Film.objects.get_object_by_public_id(self.kwargs['pk'])

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status= status.HTTP_201_CREATED)