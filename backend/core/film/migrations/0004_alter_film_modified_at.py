# Generated by Django 5.0.6 on 2024-06-19 13:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_film', '0003_film_link_alter_film_arena_alter_film_genre_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='film',
            name='modified_at',
            field=models.DateTimeField(null=True),
        ),
    ]
