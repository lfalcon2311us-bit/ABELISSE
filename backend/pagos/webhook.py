import stripe
from django.conf import settings
from django.http import HttpResponse
from rest_framework.decorators import api_view

stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(["POST"])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except Exception as e:
        return HttpResponse(status=400)

    # Evento de pago exitoso
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        # Aquí puedes actualizar inventario, registrar orden, enviar email, etc.
        print("💰 Pago confirmado:", session["id"])

    return HttpResponse(status=200)
