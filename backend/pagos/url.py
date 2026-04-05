from django.urls import path
from .views_stripe import create_checkout_session
from .webhook import stripe_webhook, paypal_webhook, yape_webhook
from .views_paypal import paypal_create_order, paypal_capture_order

urlpatterns = [
    # Stripe
    path("stripe/create-session/", create_checkout_session),
    path("stripe/webhook/", stripe_webhook),

    # PayPal
    path("paypal/create-order/", paypal_create_order),
    path("paypal/capture-order/", paypal_capture_order),
    path("paypal/webhook/", paypal_webhook),

    # Yape
    path("yape/webhook/", yape_webhook),
]
