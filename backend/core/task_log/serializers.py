from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.abstract.serializers import AbstractSerializer
from core.task_log.models import TaskLog

class TaskLogSerializer(AbstractSerializer):

    class Meta:
        model = TaskLog
        fields = '__all__'