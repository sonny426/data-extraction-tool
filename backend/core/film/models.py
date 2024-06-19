from django.db import models

from core.abstract.models import AbstractManager, AbstractModel

class FilmManager(AbstractManager):
    pass

class Film(AbstractModel):
    title = models.CharField(max_length=255, default='')
    studio = models.CharField(max_length=255, default='')
    genre = models.CharField(max_length=255, default='')
    arena = models.CharField(max_length=255, default='')
    modified_at = models.DateTimeField(null=True)
    season = models.CharField(max_length=255, default='')
    status = models.CharField(max_length=255, default='')
    link = models.CharField(max_length=255, default='')

    def __str__(self):
        return f"{self.link}"

    class Meta:
        db_table = "films"