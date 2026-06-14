from django.db import models


class ErrorReport(models.Model):
    """
    Registro de errores enviados desde el frontend o desde el backend.
    Aquí vamos a guardar:
    - mensaje corto del error
    - stack trace o detalle
    - contexto (archivo, función, ruta, etc.)
    - timestamp del momento en que ocurrió
    """

    message = models.TextField()  # Mensaje principal del error
    error = models.TextField(blank=True, null=True)  # Stack trace o detalle
    context = models.JSONField()  # Info extra: archivo, función, ruta, etc.
    timestamp = models.DateTimeField()  # Momento en que ocurrió el error
    created_at = models.DateTimeField(auto_now_add=True)  # Momento en que se guardó

    def __str__(self):
        # Para que en el admin se vea algo legible
        return f"{self.timestamp} - {self.message[:80]}"
