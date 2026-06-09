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
    queryset = Producto.objects.filter(activo=True).order_by("sku")
    serializer_class = ProductoSerializer

    # 🔥 FIX DEFINITIVO PARA NEXT.JS 16 + RSC + _rsc PARAMS
    lookup_field = "pk"
    lookup_url_kwarg = "pk"

    def get_object(self):
        """
        Permite que DRF acepte parámetros GET como ?_rsc=...
        y que Next.js pueda acceder a /api/productos/<id> sin romper.
        """
        pk = self.kwargs.get(self.lookup_url_kwarg)
        return get_object_or_404(self.queryset, pk=pk)


class ProductosDestacados(generics.ListAPIView):
    serializer_class = ProductoSerializer

    def get_queryset(self):
        return Producto.objects.filter(
            activo=True,
            destacado=True
        ).order_by("sku")
