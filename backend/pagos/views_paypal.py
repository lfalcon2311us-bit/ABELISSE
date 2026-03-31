from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from decouple import config
import requests
import json

PAYPAL_CLIENT_ID = config("PAYPAL_CLIENT_ID")
PAYPAL_SECRET = config("PAYPAL_SECRET")

# ---------------------------------------------------------
# 1) CREAR ORDEN PAYPAL (v2)
# ---------------------------------------------------------
@csrf_exempt
def paypal_create_order(request):
    body = json.loads(request.body)
    total = body.get("total")

    auth = (PAYPAL_CLIENT_ID, PAYPAL_SECRET)

    data = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "USD",
                    "value": str(total)
                }
            }
        ]
    }

    res = requests.post(
        "https://api-m.sandbox.paypal.com/v2/checkout/orders",
        json=data,
        auth=auth
    )

    return JsonResponse(res.json())


# ---------------------------------------------------------
# 2) CAPTURAR ORDEN PAYPAL (v2)
# ---------------------------------------------------------
@csrf_exempt
def paypal_capture_order(request):
    payment_id = request.GET.get("paymentId")

    auth = (PAYPAL_CLIENT_ID, PAYPAL_SECRET)

    res = requests.post(
        f"https://api-m.sandbox.paypal.com/v2/checkout/orders/{payment_id}/capture",
        auth=auth
    )

    return JsonResponse(res.json())
