from rest_framework import routers

from core.user.viewsets import UserViewSet
from core.auth.viewsets import RegisterViewSet
from core.auth.viewsets import LoginViewSet
from core.auth.viewsets import RefreshViewSet
from core.auth.viewsets import UpdateViewSet
from core.film.viewsets import FilmViewSet
from core.pdf.viewsets import PDFViewSet
from core.cookie.viewsets import CookieViewSet
from core.task_log.viewsets import TaskLogViewSet

router = routers.SimpleRouter()

router.register(r'users', UserViewSet, basename='user')
router.register(r'auth/register', RegisterViewSet, basename='auth-register')
router.register(r'auth/login', LoginViewSet, basename='auth-login')
router.register(r'auth/refresh', RefreshViewSet, basename='auth-refresh')
router.register(r'auth/password', UpdateViewSet, basename='auth-update')
router.register(r'films', FilmViewSet, basename='film')
router.register(r'pdfs', PDFViewSet, basename='pdf')
router.register(r'cookies', CookieViewSet, basename='cookie')
router.register(r'task-logs', TaskLogViewSet, basename='task-logs')

urlpatterns = [
    *router.urls,
]