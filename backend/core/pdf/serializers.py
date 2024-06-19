from rest_framework import serializers
import fitz
import os
from pathlib import Path

from core.pdf.models import PDF
from core.film.models import Film
from core.abstract.serializers import AbstractSerializer
from core.film.serializers import FilmSerializer

class PDFSerializer(AbstractSerializer):

    films = serializers.SerializerMethodField()

    class Meta:
        model = PDF
        fields = ['pdf_file', 'title', 'films']

    def get_films(self, obj):
        return [film.public_id for film in obj.films.all()]

    def extract_links_from_pdf(self, pdf_path):
        document = fitz.open(pdf_path)
        all_links = set()

        # Iterate over each page
        for page_num in range(len(document)):
            page = document.load_page(page_num)
            links = page.get_links()
            for link in links:
                if 'uri' in link:
                    if 'track_id' in link['uri']:
                        all_links.add(link['uri'])

        return all_links

    def create(self, validated_data):
        pdf = PDF.objects.create(**validated_data)

        BASE_DIR = os.path.abspath(os.path.dirname(__file__))
        film_links = self.extract_links_from_pdf(os.path.join(BASE_DIR, 'media', pdf.pdf_file.path))

        new_films = []
        for film_link in film_links:
            film = Film.objects.filter(link=film_link).first()
            if film is None:
                film = Film(link=film_link)
                film.save()
            new_films.append(film)
        pdf.films.set(new_films)
        return pdf