from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

from core.pdf.models import PDF
from core.pdf.serializers import PDFSerializer
from core.abstract.viewsets import AbstractViewSet

class PDFViewSet(AbstractViewSet):
    queryset = PDF.objects.all()
    serializer_class = PDFSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        return PDF.objects.all()

    def get_object(self):
        return PDF.objects.get_object_by_public_id(self.kwargs['pk'])
