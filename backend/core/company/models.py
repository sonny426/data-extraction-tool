from django.db import models

from core.abstract.models import AbstractManager, AbstractModel

class CompanyManager(AbstractManager):
    pass

class Company(AbstractModel):
    name = models.CharField(max_length=255, default='')
    territory = models.CharField(max_length=255, default='')
    schedule = models.CharField(max_length=255, default='')
    need_scrape = models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"{self.name}"

    class Meta:
        db_table = "companies"