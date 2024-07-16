from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action

from core.abstract.viewsets import AbstractViewSet
from core.company.models import Company
from core.company.serializers import CompanySerializer

class CompanyViewSet(AbstractViewSet):
    permission_classes = (AllowAny,)
    serializer_class = CompanySerializer
