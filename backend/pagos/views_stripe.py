import stripe
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response

stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(["POST"])
def create_checkout_session(request):
    try:
        items = request.data.get("items", [])

        line_items = []
        for item in items:
            line_items.append({
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": item["name"],
                    },
                    "unit_amount": int(float(item["price"]) * 100),
                },
                "quantity": item["quantity"],
            })

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=f"{settings.FRONTEND_URL}/success",
            cancel_url=f"{settings.FRONTEND_URL}/cancel",
        )

        return Response({"url": session.url})

    except Exception as e:
        return Response({"error": str(e)}, status=400)
