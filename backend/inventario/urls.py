from rest_framework.routers import DefaultRouter
from .views import (
    ProductoViewSet,
    CategoriaViewSet,
    SubcategoriaViewSet,
)

router = DefaultRouter()
router.register(r'productos', ProductoViewSet, basename='productos')
router.register(r'categorias', CategoriaViewSet, basename='categorias')
router.register(r'subcategorias', SubcategoriaViewSet, basename='subcategorias')

urlpatterns = router.urls
