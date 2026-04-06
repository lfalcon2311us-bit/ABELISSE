import json
import stripe
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Orden

# Servicio de correo
from gmail.gmail_service import send_email

stripe.api_key = settings.STRIPE_SECRET_KEY


# ---------------------------------------------------------
# 🔥 1) WEBHOOK STRIPE — COMPLETO + EMAIL AUTOMÁTICO
# ---------------------------------------------------------
@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except Exception as e:
        print("❌ Error en firma Stripe:", e)
        return HttpResponse(status=400)

    # Pago completado
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        stripe_id = session.get("id")

        try:
            orden = Orden.objects.get(stripe_session_id=stripe_id)
            orden.estado = "COMPLETADA"
            orden.save()

            print("💰 Stripe pago confirmado:", stripe_id)

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
# 🔥 2) WEBHOOK PAYPAL — LISTO + FIX DE `orden.total`
# ---------------------------------------------------------
@csrf_exempt
def paypal_webhook(request):
    try:
        body = json.loads(request.body)
        event_type = body.get("event_type")

        # Orden aprobada (pero no capturada)
        if event_type == "CHECKOUT.ORDER.APPROVED":
            order_id = body["resource"]["id"]

            try:
                orden = Orden.objects.get(paypal_order_id=order_id)
                orden.estado = "PENDIENTE"
                orden.save()
            except Orden.DoesNotExist:
                print("⚠️ Orden PayPal no encontrada:", order_id)

            return HttpResponse(status=200)

        # Pago completado
        if event_type == "PAYMENT.CAPTURE.COMPLETED":
            order_id = body["resource"]["supplementary_data"]["related_ids"]["order_id"]

            try:
                orden = Orden.objects.get(paypal_order_id=order_id)
                orden.estado = "COMPLETADA"
                orden.save()

                # 📧 Email automático PayPal
                if orden.email:
                    mensaje = f"""
Hola {orden.nombre},

Tu pago con PayPal en ABELISSE fue procesado con éxito.

Monto: ${orden.monto}
Estado: COMPLETADA
ID de orden: {orden.id}

Gracias por tu compra.
"""

                    send_email(
                        to=orden.email,
                        subject="Tu pago en ABELISSE fue exitoso",
                        message=mensaje
                    )

                    print("📧 Email enviado a:", orden.email)

            except Orden.DoesNotExist:
                print("⚠️ Orden PayPal no encontrada:", order_id)

            return HttpResponse(status=200)

        print("Evento PayPal recibido:", event_type)
        return HttpResponse(status=200)

    except Exception as e:
        print("❌ Error en webhook PayPal:", e)
        return HttpResponse(status=500)



# ---------------------------------------------------------
# 🔥 3) WEBHOOK YAPE — LISTO PARA API OFICIAL
# ---------------------------------------------------------
@csrf_exempt
def yape_webhook(request):
    try:
        body = json.loads(request.body)
        print("📲 Evento Yape recibido:", body)

        return HttpResponse(status=200)

    except Exception as e:
        print("❌ Error en webhook Yape:", e)
        return HttpResponse(status=500)
