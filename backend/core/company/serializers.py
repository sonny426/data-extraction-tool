from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.abstract.serializers import AbstractSerializer
from core.company.models import Company

class CompanySerializer(AbstractSerializer):

    class Meta:
        model = Company
        fields = ['id', 'name', 'territory', 'schedule', 'need_scrape', 'created_at', 'updated_at']