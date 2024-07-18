from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action

from core.abstract.viewsets import AbstractViewSet
from core.cookie.models import Cookie
from core.cookie.serializers import CookieSerializer

class CookieViewSet(AbstractViewSet):
    http_method_names = ('post', 'get')
    permission_classes = (AllowAny,)
    serializer_class = CookieSerializer

    def get_queryset(self):
        return Cookie.objects.all()

    def get_object(self):
        return Cookie.objects.get_object_by_public_id(self.kwargs['pk'])

    @action(detail=False, methods=['get'], url_path='latest')
    def get_latest(self, request):
        cookie = Cookie.objects.latest('created_at').cookie
        return Response({'cookie': cookie}, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status= status.HTTP_201_CREATED)