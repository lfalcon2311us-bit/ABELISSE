from rest_framework.generics import RetrieveAPIView
from django.shortcuts import get_object_or_404

from .models import Producto
from .serializers import ProductoSerializer


class ProductoDetalleView(RetrieveAPIView):
    queryset = Producto.objects.filter(activo=True)
    serializer_class = ProductoSerializer
    lookup_field = "pk"

    def get_object(self):
        pk = self.kwargs.get(self.lookup_field)

        # Validación segura del ID
        try:
            pk_int = int(pk)
        except (TypeError, ValueError):
            raise get_object_or_404(self.queryset, pk=-1)

        return get_object_or_404(self.queryset, pk=pk_int)
