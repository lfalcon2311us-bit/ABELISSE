# ---------------------------------------------------------
# 🔥 IMPORTS
# ---------------------------------------------------------
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView

from .models import Categoria, Producto
from .serializers import CategoriaSerializer, ProductoSerializer


# ---------------------------------------------------------
# 🔥 1) CATEGORÍAS
# ---------------------------------------------------------
class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    lookup_field = "id"


# ---------------------------------------------------------
# 🔥 2) PRODUCTOS — LISTA + DETALLE AUTOMÁTICO
# ---------------------------------------------------------
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all().order_by("-fecha_creacion")
    serializer_class = ProductoSerializer
    lookup_field = "id"
    lookup_url_kwarg = "id"   # ← 🔥 FIX CRÍTICO


# ---------------------------------------------------------
# 🔥 3) PRODUCTO DETALLE (OPCIONAL)
# ---------------------------------------------------------
class ProductoDetalleView(RetrieveAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    lookup_field = "id"
    lookup_url_kwarg = "id"   # ← 🔥 FIX CRÍTICO


# ---------------------------------------------------------
# 🔥 4) PRODUCTOS DESTACADOS — VERSIÓN ESTABLE
# ---------------------------------------------------------
class ProductosDestacados(APIView):
    def get(self, request):

        mas_vendidos = Producto.objects.order_by("-ventas_totales")[:10]
        mas_buscados = Producto.objects.order_by("-busquedas_totales")[:10]
        nuevos = Producto.objects.order_by("-fecha_creacion")[:10]
        mejor_calificados = Producto.objects.order_by("-calificacion_promedio")[:10]

        data = {
            "mas_vendidos": ProductoSerializer(mas_vendidos, many=True).data,
            "mas_buscados": ProductoSerializer(mas_buscados, many=True).data,
            "nuevos": ProductoSerializer(nuevos, many=True).data,
            "mejor_calificados": ProductoSerializer(mejor_calificados, many=True).data,
        }

        return Response(data)
