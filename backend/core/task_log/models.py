from django.db import models

from core.abstract.models import AbstractModel

class TaskLog(AbstractModel):
    scrape_link = models.CharField(max_length=255, default='')
    status = models.CharField(max_length=50, default='')
    result = models.CharField(max_length=255, default='')

    class Meta:
        db_table = "task_logs"

    def __str__(self):
        return self.scrape_link
