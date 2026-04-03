from django.contrib import admin
from django.urls import path, include, re_path
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

# Swagger / OpenAPI
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


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

    # Yape
    path("api/yape/webhook/", yape_webhook),

    # Estadísticas
    path("api/estadisticas/", EstadisticasView.as_view()),

    # Swagger UI
    re_path(r"^docs/$", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),

    # Redoc
    re_path(r"^redoc/$", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),

    # OpenAPI JSON
    re_path(r"^openapi.json$", schema_view.without_ui(cache_timeout=0), name="schema-json"),
]
