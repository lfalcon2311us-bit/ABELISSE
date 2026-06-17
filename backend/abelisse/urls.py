from django.contrib import admin
from django.urls import path, include, re_path
from django.http import JsonResponse
from rest_framework import routers, permissions

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

# PayPal
from pagos.views_paypal import paypal_create_order, paypal_capture_order

# Estadísticas
from pagos.views_estadisticas import EstadisticasView

# GEO
from pagos.views_geo import detectar_pais

# Swagger
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


def home(request):
    return JsonResponse({
        "status": "online",
        "project": "ABELISSE Backend",
        "version": "1.0.0",
        "docs": "/docs/",
        "redoc": "/redoc/",
        "openapi": "/openapi.json",
        "message": "API funcionando correctamente"
    })


schema_view = get_schema_view(
    openapi.Info(
        title="ABELISSE API",
        default_version="v1",
        description="Documentación oficial del backend ABELISSE",
        contact=openapi.Contact(email="lfalcon2311us@abelisse.com"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# ---------------------------------------------------------
# 🔥 ROUTER — FIX CRÍTICO PARA lookup_field="id"
# ---------------------------------------------------------
router = routers.DefaultRouter()
router.register(r"categorias", CategoriaViewSet, basename="categorias")
router.register(r"productos", ProductoViewSet, basename="productos")


urlpatterns = [
    path("", home),

    path("admin/", admin.site.urls),
    path('api/', include('reportes.urls')),

    # API REST
    path("api/", include(router.urls)),
    path("api/productos-destacados/", ProductosDestacados.as_view()),
    path("api/suscribirse/", suscribirse),

    # GEO
    path("api/geo/", detectar_pais),

    # Stripe
    path("api/checkout/create-session/", create_checkout_session),
    path("api/stripe/webhook/", stripe_webhook),

    # PayPal
    path("api/paypal/create-order/", paypal_create_order),
    path("api/paypal/capture-order/", paypal_capture_order),
    path("api/paypal/webhook/", paypal_webhook),

    # Yape
    path("api/yape/webhook/", yape_webhook),

    # Estadísticas
    path("api/estadisticas/", EstadisticasView.as_view()),

    # Swagger
    re_path(r"^docs/$", schema_view.with_ui("swagger", cache_timeout=0)),
    re_path(r"^redoc/$", schema_view.with_ui("redoc", cache_timeout=0)),
    re_path(r"^openapi.json$", schema_view.without_ui(cache_timeout=0)),
]
