from rest_framework import viewsets, generics
from django.shortcuts import get_object_or_404

from .models import Categoria, Producto
from .serializers import CategoriaSerializer, ProductoSerializer


class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.all().order_by("nombre")
    serializer_class = CategoriaSerializer
    lookup_field = "slug"


class ProductoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductoSerializer
    lookup_field = "pk"
    lookup_url_kwarg = "pk"

    def get_queryset(self):
        queryset = Producto.objects.filter(activo=True).order_by("sku")

        # 🔥 FILTRO POR CATEGORÍA
        categoria_slug = self.request.query_params.get("categoria")
        if categoria_slug:
            queryset = queryset.filter(categoria__slug__iexact=categoria_slug)

        return queryset

    def get_object(self):
        pk = self.kwargs.get(self.lookup_url_kwarg)

        try:
            pk_int = int(pk)
        except (TypeError, ValueError):
            raise get_object_or_404(self.get_queryset(), pk=-1)

        return get_object_or_404(self.get_queryset(), pk=pk_int)


class ProductosDestacados(generics.ListAPIView):
    serializer_class = ProductoSerializer

    def get_queryset(self):
        return Producto.objects.filter(
            activo=True,
            destacado=True
        ).order_by("sku")
