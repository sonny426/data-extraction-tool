from rest_framework import routers

from core.user.viewsets import UserViewSet
from core.auth.viewsets import RegisterViewSet
from core.auth.viewsets import LoginViewSet
from core.auth.viewsets import RefreshViewSet
from core.film.viewsets import FilmViewSet
from core.pdf.viewsets import PDFViewSet

router = routers.SimpleRouter()

router.register(r'users', UserViewSet, basename='user')
router.register(r'auth/register', RegisterViewSet, basename='auth-register')
router.register(r'auth/login', LoginViewSet, basename='auth-login')
router.register(r'auth/refresh', RefreshViewSet, basename='auth-refresh')
router.register(r'films', FilmViewSet, basename='film')
router.register(r'pdfs', PDFViewSet, basename='pdf')

urlpatterns = [
    *router.urls,
]