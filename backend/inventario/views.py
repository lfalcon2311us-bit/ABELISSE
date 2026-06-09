from rest_framework import viewsets, generics
from django.shortcuts import get_object_or_404

from .models import Categoria, Producto
from .serializers import CategoriaSerializer, ProductoSerializer


class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.all().order_by("nombre")
    serializer_class = CategoriaSerializer
    lookup_field = "slug"


class ProductoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Producto.objects.filter(activo=True).order_by("sku")
    serializer_class = ProductoSerializer
    lookup_field = "pk"
    lookup_url_kwarg = "pk"

    def get_object(self):
        pk = self.kwargs.get(self.lookup_url_kwarg)

        # Si viene "undefined", None, vacío, etc. → 404 limpio
        try:
            pk_int = int(pk)
        except (TypeError, ValueError):
            raise get_object_or_404(self.queryset, pk=-1)  # fuerza 404

        return get_object_or_404(self.queryset, pk=pk_int)


class ProductosDestacados(generics.ListAPIView):
    serializer_class = ProductoSerializer

    def get_queryset(self):
        return Producto.objects.filter(
            activo=True,
            destacado=True
        ).order_by("sku")
