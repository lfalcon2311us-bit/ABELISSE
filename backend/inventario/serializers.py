from rest_framework import serializers
from .models import Categoria, Subcategoria, Producto


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = "__all__"


class SubcategoriaSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)

    class Meta:
        model = Subcategoria
        fields = "__all__"


class ProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)
    subcategoria = SubcategoriaSerializer(read_only=True)

    # Imágenes en base64
    imagen_principal = serializers.SerializerMethodField()
    imagen_secundaria = serializers.SerializerMethodField()
    imagen_terciaria = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        read_only_fields = [
            # Slug auto
            "slug",

            # Contabilidad calculada
            "valor_total_unidad",
            "valor_general",
            "descuento_soles",
            "descuento_porcentaje",
            "ganancia_unidad",
            "ganancia_total",

            # Analítica calculada
            "ventas_totales",
            "busquedas_totales",
            "calificacion_promedio",
            "total_calificaciones",
        ]

        fields = [
            "id",
            "sku",
            "marca",
            "nombre",
            "slug",
            "descripcion",
            "tamano",
            "categoria",
            "subcategoria",
            "stock",

            # Precios editables
            "costo_compra",
            "taxes",
            "precio_importacion",
            "precio_venta_usd",
            "precio_venta_soles",
            "precio_mercado_soles",

            # Contabilidad calculada
            "valor_total_unidad",
            "valor_general",
            "descuento_soles",
            "descuento_porcentaje",
            "ganancia_unidad",
            "ganancia_total",

            # Imágenes
            "imagen_principal",
            "imagen_secundaria",
            "imagen_terciaria",

            # Estado
            "destacado",
            "activo",

            # Analítica calculada
            "ventas_totales",
            "busquedas_totales",
            "calificacion_promedio",
            "total_calificaciones",

            # Nuevos campos
            "verificacion_katy",
            "cantidad_recibida",
        ]

    # ---------------------------------------------------------
    # IMÁGENES BASE64
    # ---------------------------------------------------------
    def _return_image(self, data):
        if not data:
            return None
        if isinstance(data, str) and data.startswith("data:image"):
            return data
        return None

    def get_imagen_principal(self, obj):
        return self._return_image(obj.imagen_principal)

    def get_imagen_secundaria(self, obj):
        return self._return_image(obj.imagen_secundaria)

    def get_imagen_terciaria(self, obj):
        return self._return_image(obj.imagen_terciaria)
