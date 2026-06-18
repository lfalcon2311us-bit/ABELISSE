import json
import requests
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Orden
from inventario.models import Producto
from gmail.gmail_service import send_email


# ---------------------------------------------------------
# 🔥 1) OBTENER TOKEN DE PAYPAL
# ---------------------------------------------------------
def get_paypal_token():
    url = "https://api-m.paypal.com/v1/oauth2/token"  # LIVE

    auth = (settings.PAYPAL_CLIENT_ID, settings.PAYPAL_SECRET)

    headers = {"Accept": "application/json", "Accept-Language": "en_US"}
    data = {"grant_type": "client_credentials"}

    response = requests.post(url, headers=headers, data=data, auth=auth)

    if response.status_code != 200:
        print("❌ Error obteniendo token PayPal:", response.text)
        return None

    return response.json().get("access_token")


# ---------------------------------------------------------
# 🔥 2) CREAR ORDEN PAYPAL
# ---------------------------------------------------------
@csrf_exempt
def paypal_create_order(request):
    try:
        body = json.loads(request.body)

        total = body.get("total")
        carrito = body.get("carrito", [])
        email = body.get("email")
        nombre = body.get("nombre")

        total_float = float(total)

        token = get_paypal_token()
        if not token:
            return JsonResponse({"error": "No se pudo obtener token PayPal"}, status=500)

        url = "https://api-m.paypal.com/v2/checkout/orders"

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
        }

        data = {
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": "USD",
                        "value": f"{total_float:.2f}",
                    }
                }
            ],
            "application_context": {
                "return_url": f"{settings.FRONTEND_URL}/pago-exitoso",
                "cancel_url": f"{settings.FRONTEND_URL}/pago-fallido",
            },
        }

        response = requests.post(url, headers=headers, json=data)

        if response.status_code not in [200, 201]:
            print("❌ Error creando orden PayPal:", response.text)
            return JsonResponse({"error": "Error creando orden PayPal"}, status=500)

        order = response.json()
        order_id = order["id"]

        # Guardar orden
        Orden.objects.create(
            paypal_order_id=order_id,
            monto=total_float,
            moneda="USD",
            metodo="paypal",
            estado="CREADA",
            carrito=carrito,
            email=email,
            nombre=nombre,
        )

        approve_url = next(
            (link["href"] for link in order["links"] if link["rel"] == "approve"),
            None,
        )

        return JsonResponse({"approve_url": approve_url, "order_id": order_id})

    except Exception as e:
        print("❌ Error PayPal create_order:", e)
        return JsonResponse({"error": str(e)}, status=500)


# ---------------------------------------------------------
# 🔥 3) CAPTURAR ORDEN PAYPAL + STOCK + CARRITO + EMAIL
# ---------------------------------------------------------
@csrf_exempt
def paypal_capture_order(request):
    try:
        body = json.loads(request.body)
        order_id = body.get("order_id")

        if not order_id:
            return JsonResponse({"error": "order_id requerido"}, status=400)

        token = get_paypal_token()
        if not token:
            return JsonResponse({"error": "No se pudo obtener token PayPal"}, status=500)

        url = f"https://api-m.paypal.com/v2/checkout/orders/{order_id}/capture"

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
        }

        response = requests.post(url, headers=headers)

        if response.status_code not in [200, 201]:
            print("❌ Error capturando orden PayPal:", response.text)
            return JsonResponse({"error": "Error capturando orden PayPal"}, status=500)

        # Buscar orden
        try:
            orden = Orden.objects.get(paypal_order_id=order_id)
        except Orden.DoesNotExist:
            print("⚠️ Orden PayPal no encontrada:", order_id)
            return JsonResponse({"error": "Orden no encontrada"}, status=404)

        # ---------------------------------------------------------
        # 🔥 MARCAR COMO COMPLETADA
        # ---------------------------------------------------------
        orden.estado = "COMPLETADA"
        orden.save()
        print("💰 PayPal pago confirmado:", order_id)

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
        # 📧 ENVIAR CORREO
        # ---------------------------------------------------------
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

        return JsonResponse({"status": "COMPLETADA"})

    except Exception as e:
        print("❌ Error PayPal capture_order:", e)
        return JsonResponse({"error": str(e)}, status=500)
