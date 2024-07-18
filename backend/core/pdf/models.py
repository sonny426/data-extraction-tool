from django.db import models

from core.abstract.models import AbstractModel
from core.film.models import Film

class PDF(AbstractModel):
    title = models.CharField(max_length=255, unique=True, default='')
    pdf_file = models.FileField(upload_to='pdf_files/', null=True)
    recollect = models.BooleanField(default=False)
    films = models.ManyToManyField(Film)

    REQUIRED_FIELDS = ['title', 'pdf_file']

    class Meta:
        db_table = "pdfs"
