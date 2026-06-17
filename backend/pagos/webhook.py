import json
import stripe
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Orden
from inventario.models import Producto

# Servicio de correo
from gmail.gmail_service import send_email

# Clave secreta de Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


# ---------------------------------------------------------
# 🔥 WEBHOOK STRIPE — COMPLETO + STOCK + CARRITO + EMAIL
# ---------------------------------------------------------
@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    # Validar firma
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except Exception as e:
        print("❌ Error en firma Stripe:", e)
        return HttpResponse(status=400)

    # Evento principal
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        stripe_id = session.get("id")

        try:
            orden = Orden.objects.get(stripe_session_id=stripe_id)
            orden.estado = "COMPLETADA"
            orden.save()

            print("💰 Stripe pago confirmado:", stripe_id)

            # ---------------------------------------------------------
            # 🔥 DESCONTAR STOCK
            # ---------------------------------------------------------
            carrito = orden.carrito or []

            for item in carrito:
                producto_id = item.get("id")
                cantidad = item.get("cantidad", 1)

                try:
                    producto = Producto.objects.get(id=producto_id)
                    producto.stock = max(producto.stock - cantidad, 0)
                    producto.save()
                    print(f"📦 Stock actualizado: {producto.nombre} - {producto.stock}")
                except Producto.DoesNotExist:
                    print("⚠️ Producto no encontrado:", producto_id)

            # ---------------------------------------------------------
            # 🔥 LIMPIAR CARRITO
            # ---------------------------------------------------------
            orden.carrito = []
            orden.save()
            print("🛒 Carrito limpiado")

            # ---------------------------------------------------------
            # 📧 Enviar correo automático al cliente
            # ---------------------------------------------------------
            if orden.email:
                mensaje = f"""
Hola {orden.nombre},

Tu pago en ABELISSE fue procesado con éxito.

Monto: ${orden.monto}
Estado: COMPLETADA
ID de orden: {orden.id}

Gracias por tu compra.
Pronto recibirás más detalles sobre tu pedido.

Equipo ABELISSE
"""

                send_email(
                    to=orden.email,
                    subject="Tu pago en ABELISSE fue exitoso",
                    message=mensaje
                )

                print("📧 Email enviado a:", orden.email)

        except Orden.DoesNotExist:
            print("⚠️ Orden Stripe no encontrada:", stripe_id)

    return HttpResponse(status=200)
