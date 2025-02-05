# Generated by Django 5.0.6 on 2024-07-18 07:24

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core_film', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PDF',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('public_id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(default='', max_length=255, unique=True)),
                ('pdf_file', models.FileField(null=True, upload_to='pdf_files/')),
                ('recollect', models.BooleanField(default=False)),
                ('films', models.ManyToManyField(to='core_film.film')),
            ],
            options={
                'db_table': 'pdfs',
            },
        ),
    ]
