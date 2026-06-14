from django.urls import path
from .views import ErrorReportCreateView

urlpatterns = [
    path('error-report/', ErrorReportCreateView.as_view(), name='error-report'),
]
