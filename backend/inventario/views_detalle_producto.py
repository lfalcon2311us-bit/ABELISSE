from rest_framework.generics import RetrieveAPIView
from .models import Producto
from .serializers import ProductoSerializer

class ProductoDetalleView(RetrieveAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    lookup_field = "id"
