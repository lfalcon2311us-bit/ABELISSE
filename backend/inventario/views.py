from rest_framework import viewsets, generics
from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404

from .models import Categoria, Producto
from .serializers import CategoriaSerializer, ProductoSerializer


# ---------------------------------------------------------
#  VIEWSETS EXISTENTES (NO TOCADOS)
# ---------------------------------------------------------
class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.all().order_by("nombre")
    serializer_class = CategoriaSerializer
    lookup_field = "slug"


class ProductoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Producto.objects.filter(activo=True).order_by("-fecha_creacion")
    serializer_class = ProductoSerializer
    lookup_field = "pk"  # ← FIX REAL


class ProductosDestacados(generics.ListAPIView):
    serializer_class = ProductoSerializer

    def get_queryset(self):
        return Producto.objects.filter(
            activo=True,
            destacado=True
        ).order_by("-fecha_creacion")


# ---------------------------------------------------------
#  🔥 NUEVO: ENDPOINT PARA SERVIR IMÁGENES DESDE POSTGRESQL
# ---------------------------------------------------------
def imagen_producto(request, id, tipo):
    """
    Devuelve la imagen binaria del producto según el tipo:
    - principal
    - secundaria
    - terciaria
    """

    producto = get_object_or_404(Producto, id=id)

    if tipo == "principal":
        data = producto.imagen_principal
        mime = producto.imagen_principal_mime

    elif tipo == "secundaria":
        data = producto.imagen_secundaria
        mime = producto.imagen_secundaria_mime

    elif tipo == "terciaria":
        data = producto.imagen_terciaria
        mime = producto.imagen_terciaria_mime

    else:
        raise Http404("Tipo de imagen no válido")

    if not data:
        raise Http404("Imagen no encontrada")

    return HttpResponse(data, content_type=mime)
