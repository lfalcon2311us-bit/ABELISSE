from rest_framework import serializers
from .models import ErrorReport


class ErrorReportSerializer(serializers.ModelSerializer):
    """
    Serializer para recibir y validar los reportes de error
    enviados desde el frontend.
    """

    class Meta:
        model = ErrorReport
        fields = '__all__'
