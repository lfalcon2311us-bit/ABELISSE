from rest_framework import viewsets, generics
from django.shortcuts import get_object_or_404

from .models import Categoria, Producto
from .serializers import CategoriaSerializer, ProductoSerializer


# ---------------------------------------------------------
#  VIEWSETS EXISTENTES
# ---------------------------------------------------------
class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.all().order_by("nombre")
    serializer_class = CategoriaSerializer
    lookup_field = "slug"


class ProductoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Producto.objects.filter(activo=True).order_by("-fecha_creacion")
    serializer_class = ProductoSerializer
    lookup_field = "pk"  # ← correcto


class ProductosDestacados(generics.ListAPIView):
    serializer_class = ProductoSerializer

    def get_queryset(self):
        return Producto.objects.filter(
            activo=True,
            destacado=True
        ).order_by("-fecha_creacion")
