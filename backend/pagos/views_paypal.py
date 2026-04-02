import json
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from decouple import config
from .models import Orden

PAYPAL_CLIENT_ID = config("PAYPAL_CLIENT_ID")
PAYPAL_SECRET = config("PAYPAL_SECRET")


# ---------------------------------------------------------
# 🔥 0) OBTENER ACCESS TOKEN PAYPAL
# ---------------------------------------------------------
def get_paypal_access_token():
    url = "https://api-m.sandbox.paypal.com/v1/oauth2/token"

    headers = {
        "Accept": "application/json",
        "Accept-Language": "en_US",
    }

    data = {"grant_type": "client_credentials"}

    response = requests.post(
        url,
        headers=headers,
        data=data,
        auth=(PAYPAL_CLIENT_ID, PAYPAL_SECRET)
    )

    if response.status_code != 200:
        print("❌ Error obteniendo token PayPal:", response.text)
        return None

    return response.json().get("access_token")


# ---------------------------------------------------------
# 🔥 1) CREAR ORDEN PAYPAL
# ---------------------------------------------------------
@csrf_exempt
def paypal_create_order(request):
    try:
        body = json.loads(request.body)

        total = body.get("total")
        carrito = body.get("carrito", [])
        email = body.get("email", None)
        nombre = body.get("nombre", None)

        if not total or float(total) <= 0:
            return JsonResponse({"error": "Total inválido"}, status=400)

        access_token = get_paypal_access_token()
        if not access_token:
            return JsonResponse({"error": "No se pudo obtener token PayPal"}, status=500)

        url = "https://api-m.sandbox.paypal.com/v2/checkout/orders"

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
        }

        data = {
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": "USD",
                        "value": f"{float(total):.2f}"
                    }
                }
            ]
        }

        response = requests.post(url, headers=headers, json=data)

        if response.status_code not in [200, 201]:
            print("❌ Error creando orden:", response.text)
            return JsonResponse({"error": "Error creando orden"}, status=500)

        order_data = response.json()
        paypal_order_id = order_data.get("id")

        # ---------------------------------------------------------
        # 🔥 GUARDAR ORDEN EN LA BASE DE DATOS (estado: CREADA)
        # ---------------------------------------------------------
        Orden.objects.create(
            paypal_order_id=paypal_order_id,
            monto=float(total),
            moneda="USD",
            metodo="paypal",
            estado="CREADA",
            carrito=carrito,
            email=email,
            nombre=nombre,
        )

        return JsonResponse(order_data, safe=False)

    except Exception as e:
        print("❌ Error en create-order:", e)
        return JsonResponse({"error": "Error interno"}, status=500)


# ---------------------------------------------------------
# 🔥 2) CAPTURAR ORDEN PAYPAL
# ---------------------------------------------------------
@csrf_exempt
def paypal_capture_order(request):
    try:
        body = json.loads(request.body)
        order_id = body.get("orderID")

        if not order_id:
            return JsonResponse({"error": "orderID requerido"}, status=400)

        access_token = get_paypal_access_token()
        if not access_token:
            return JsonResponse({"error": "No se pudo obtener token PayPal"}, status=500)

        url = f"https://api-m.sandbox.paypal.com/v2/checkout/orders/{order_id}/capture"

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
        }

        response = requests.post(url, headers=headers)

        if response.status_code not in [200, 201]:
            print("❌ Error capturando orden:", response.text)
            return JsonResponse({"error": "Error capturando orden"}, status=500)

        data = response.json()

        # ---------------------------------------------------------
        # 🔥 ACTUALIZAR ORDEN EN LA BASE DE DATOS
        # ---------------------------------------------------------
        try:
            orden = Orden.objects.get(paypal_order_id=order_id)
            orden.estado = "COMPLETADA"
            orden.save()
        except Orden.DoesNotExist:
            print("⚠️ Orden no encontrada en BD:", order_id)

        return JsonResponse(data, safe=False)

    except Exception as e:
        print("❌ Error en capture-order:", e)
        return JsonResponse({"error": "Error interno"}, status=500)
