from django.db import models
from django.utils import timezone


class Orden(models.Model):
    # ID de PayPal o Stripe
    paypal_order_id = models.CharField(max_length=200, blank=True, null=True)
    stripe_session_id = models.CharField(max_length=200, blank=True, null=True)

    # Datos del cliente
    email = models.EmailField(blank=True, null=True)
    nombre = models.CharField(max_length=200, blank=True, null=True)

    # Monto total
    monto = models.DecimalField(max_digits=10, decimal_places=2)

    # Moneda (USD o PEN)
    moneda = models.CharField(max_length=10, default="USD")

    # Método de pago
    metodo = models.CharField(
        max_length=20,
        choices=[
            ("paypal", "PayPal"),
            ("stripe", "Stripe"),
            ("yape", "Yape"),
        ],
        default="paypal"
    )

    # Estado de la orden
    estado = models.CharField(
        max_length=20,
        choices=[
            ("CREADA", "Creada"),
            ("PENDIENTE", "Pendiente"),
            ("COMPLETADA", "Completada"),
            ("FALLIDA", "Fallida"),
        ],
        default="CREADA"
    )

    # Carrito completo en JSON
    carrito = models.JSONField(default=dict)

    # Fecha
    fecha = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Orden #{self.id} - {self.metodo} - {self.estado}"
