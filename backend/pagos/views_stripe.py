import json
import stripe
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Orden

stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def create_checkout_session(request):
    try:
        body = json.loads(request.body)

        total = body.get("total")
        carrito = body.get("carrito", [])
        email = body.get("email")
        nombre = body.get("nombre")

        if not total or float(total) <= 0:
            return JsonResponse({"error": "Total inválido"}, status=400)

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {"name": "Compra en ABELISSE"},
                        "unit_amount": int(float(total) * 100),
                    },
                    "quantity": 1,
                }
            ],
            success_url=f"{settings.FRONTEND_URL}/pago-exitoso",
            cancel_url=f"{settings.FRONTEND_URL}/pago-fallido",
        )

        Orden.objects.create(
            stripe_session_id=session.id,
            monto=float(total),
            moneda="USD",
            metodo="stripe",
            estado="CREADA",
            carrito=carrito,
            email=email,
            nombre=nombre,
        )

        return JsonResponse({"sessionId": session.id})

    except Exception as e:
        print("❌ Error creando sesión Stripe:", e)
        return JsonResponse({"error": "Error interno"}, status=500)
