from rest_framework.permissions import AllowAny
from rest_framework import status

from core.abstract.viewsets import AbstractViewSet
from core.task_log.models import TaskLog
from core.task_log.serializers import TaskLogSerializer

class TaskLogViewSet(AbstractViewSet):
    http_method_names = ('post', 'get')
    permission_classes = (AllowAny,)
    serializer_class = TaskLogSerializer

    def get_queryset(self):
        return TaskLog.objects.all()

    def get_object(self):
        return TaskLog.objects.get_object_by_public_id(self.kwargs['pk'])