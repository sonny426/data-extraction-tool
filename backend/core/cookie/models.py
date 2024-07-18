from django.db import models

from core.abstract.models import AbstractManager, AbstractModel

class CookieManager(AbstractManager):
    pass

class Cookie(AbstractModel):
    cookie = models.CharField(max_length=4095, default='')

    def __str__(self):
        return f"{self.link}"

    class Meta:
        db_table = "cookies"