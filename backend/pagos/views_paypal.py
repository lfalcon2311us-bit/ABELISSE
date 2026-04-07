import json
import requests
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Orden


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

        try:
            total_float = float(total)
        except:
            return JsonResponse({"error": "Total inválido"}, status=400)

        if total_float <= 0:
            return JsonResponse({"error": "Total inválido"}, status=400)

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

        # URL de aprobación (para flujos que la necesiten)
        approve_url = next(
            (link["href"] for link in order["links"] if link["rel"] == "approve"),
            None,
        )

        return JsonResponse({"approve_url": approve_url, "order_id": order_id})

    except Exception as e:
        print("❌ Error PayPal create_order:", e)
        return JsonResponse({"error": str(e)}, status=500)


# ---------------------------------------------------------
# 🔥 3) CAPTURAR ORDEN PAYPAL
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

        # Actualizar orden
        try:
            orden = Orden.objects.get(paypal_order_id=order_id)
            orden.estado = "COMPLETADA"
            orden.save()
        except Orden.DoesNotExist:
            print("⚠️ Orden PayPal no encontrada:", order_id)

        return JsonResponse({"status": "COMPLETADA"})

    except Exception as e:
        print("❌ Error PayPal capture_order:", e)
        return JsonResponse({"error": str(e)}, status=500)
