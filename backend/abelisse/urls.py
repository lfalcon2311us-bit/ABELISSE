from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

# Inventario
from inventario.views import (
    CategoriaViewSet,
    ProductoViewSet,
    ProductosDestacados,
)

# Comunidad
from comunidad.views import suscribirse

# Stripe
from pagos.views_stripe import create_checkout_session
from pagos.webhook import stripe_webhook, paypal_webhook, yape_webhook

# PayPal (FUNCIONES)
from pagos.views_paypal import paypal_create_order, paypal_capture_order


router = routers.DefaultRouter()
router.register(r'categorias', CategoriaViewSet)
router.register(r'productos', ProductoViewSet)


urlpatterns = [
    path('admin/', admin.site.urls),

    # API REST
    path('api/', include(router.urls)),

    # Productos destacados
    path("api/productos-destacados/", ProductosDestacados.as_view()),

    # Suscripción
    path('api/suscribirse/', suscribirse),

    # Stripe
    path("api/checkout/create-session/", create_checkout_session),
    path("api/stripe/webhook/", stripe_webhook),

    # PayPal
    path("api/paypal/create-order/", paypal_create_order),
    path("api/paypal/capture-order/", paypal_capture_order),
    path("api/paypal/webhook/", paypal_webhook),

    # Yape (placeholder listo)
    path("api/yape/webhook/", yape_webhook),
]
