from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

# Inventario
from inventario.views import (
    CategoriaViewSet,
    ProductoViewSet,
    ProductosDestacados,   # ← nuevo endpoint
)

# Comunidad
from comunidad.views import suscribirse

# Stripe
from pagos.views_stripe import create_checkout_session
from pagos.webhook import stripe_webhook

# PayPal
from pagos.views_paypal import paypal_create_order, paypal_capture_order


# Router para la API REST
router = routers.DefaultRouter()
router.register(r'categorias', CategoriaViewSet)
router.register(r'productos', ProductoViewSet)


urlpatterns = [
    path('admin/', admin.site.urls),

    # API de inventario
    path('api/', include(router.urls)),

    # 🔥 Nuevo endpoint de productos destacados
    path("api/productos-destacados/", ProductosDestacados.as_view()),

    # API de suscripción
    path('api/suscribirse/', suscribirse),

    # Stripe
    path("api/checkout/create-session/", create_checkout_session),
    path("api/stripe/webhook/", stripe_webhook),

    # PayPal
    path("api/paypal/create-order/", paypal_create_order),
    path("api/paypal/capture-order/", paypal_capture_order),
]
