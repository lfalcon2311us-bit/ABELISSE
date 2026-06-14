from rest_framework import generics
from .models import ErrorReport
from .serializers import ErrorReportSerializer


class ErrorReportCreateView(generics.CreateAPIView):
    """
    Endpoint que recibe los reportes de error enviados desde el frontend.
    Guarda:
    - mensaje
    - stack trace
    - contexto (archivo, función, ruta, etc.)
    - timestamp del error
    """

    queryset = ErrorReport.objects.all()
    serializer_class = ErrorReportSerializer
