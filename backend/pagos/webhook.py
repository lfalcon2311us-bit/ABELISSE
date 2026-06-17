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



# ---------------------------------------------------------
# 🔵 WEBHOOK PAYPAL — COMPLETO + STOCK + CARRITO + EMAIL
# ---------------------------------------------------------
@csrf_exempt
def paypal_webhook(request):
    try:
        body = request.body.decode("utf-8")
        data = json.loads(body)
        print("📨 Webhook PayPal recibido:", data)

        # 1️⃣ Extraer ID de la orden PayPal
        paypal_order_id = (
            data.get("resource", {}).get("id")
            or data.get("id")
            or data.get("resource", {}).get("supplementary_data", {}).get("related_ids", {}).get("order_id")
        )

        if not paypal_order_id:
            print("⚠️ No se encontró ID de orden PayPal en el webhook")
            return HttpResponse(status=200)

        print("🆔 PayPal Order ID:", paypal_order_id)

        # 2️⃣ Buscar la orden en tu base de datos
        try:
            orden = Orden.objects.get(paypal_order_id=paypal_order_id)
        except Orden.DoesNotExist:
            print("⚠️ Orden PayPal no encontrada en BD:", paypal_order_id)
            return HttpResponse(status=200)

        # 3️⃣ Marcar orden como COMPLETADA
        orden.estado = "COMPLETADA"
        orden.save()
        print("💰 PayPal pago confirmado:", paypal_order_id)

        # 4️⃣ DESCONTAR STOCK
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

        # 5️⃣ LIMPIAR CARRITO
        orden.carrito = []
        orden.save()
        print("🛒 Carrito limpiado")

        # 6️⃣ ENVIAR CORREO AL CLIENTE
        if orden.email:
            mensaje = f"""
Hola {orden.nombre},

Tu pago con PayPal en ABELISSE fue procesado con éxito.

Monto: ${orden.monto}
Estado: COMPLETADA
ID de orden: {orden.id}

Gracias por tu compra.
Pronto recibirás más detalles sobre tu pedido.

Equipo ABELISSE
"""

            send_email(
                to=orden.email,
                subject="Tu pago con PayPal en ABELISSE fue exitoso",
                message=mensaje
            )

            print("📧 Email enviado a:", orden.email)

    except Exception as e:
        print("❌ Error en webhook PayPal:", e)

    return HttpResponse(status=200)



# ---------------------------------------------------------
# 🟣 WEBHOOK YAPE — PLACEHOLDER
# ---------------------------------------------------------
@csrf_exempt
def yape_webhook(request):
    print("📨 Webhook Yape recibido")
    return HttpResponse(status=200)
