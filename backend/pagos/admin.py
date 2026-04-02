from django.contrib import admin
from .models import Orden

@admin.register(Orden)
class OrdenAdmin(admin.ModelAdmin):
    list_display = ("id", "metodo", "monto", "moneda", "estado", "fecha")
    list_filter = ("metodo", "estado", "moneda")
    search_fields = ("paypal_order_id", "stripe_session_id", "email")
