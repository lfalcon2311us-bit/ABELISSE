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

    # 🔥 Las imágenes ya vienen como base64 desde el modelo
    imagen_principal = serializers.SerializerMethodField()
    imagen_secundaria = serializers.SerializerMethodField()
    imagen_terciaria = serializers.SerializerMethodField()

    class Meta:
        model = Producto
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
            "costo_compra",
            "taxes",
            "precio_importacion",
            "valor_total_unidad",
            "valor_general",
            "precio_venta_usd",
            "precio_venta_soles",
            "precio_mercado_soles",
            "descuento_soles",
            "descuento_porcentaje",
            "ganancia_unidad",
            "ganancia_total",

            # 🔥 Imágenes ya comprimidas y en base64
            "imagen_principal",
            "imagen_secundaria",
            "imagen_terciaria",

            "destacado",
            "activo",
            "ventas_totales",
            "busquedas_totales",
            "calificacion_promedio",
            "total_calificaciones",
            "fecha_creacion",
            "fecha_actualizacion",
        ]

    # ---------------------------------------------------------
    # 🔥 MÉTODOS PARA DEVOLVER BASE64 YA LISTO
    # ---------------------------------------------------------
    def _return_image(self, data):
        """
        Las imágenes YA están en base64 desde el modelo.
        Solo devolvemos la cadena si existe y es válida.
        """
        if not data:
            return None

        # Validación mínima para evitar errores
        if isinstance(data, str) and data.startswith("data:image"):
            return data

        return None

    def get_imagen_principal(self, obj):
        return self._return_image(obj.imagen_principal)

    def get_imagen_secundaria(self, obj):
        return self._return_image(obj.imagen_secundaria)

    def get_imagen_terciaria(self, obj):
        return self._return_image(obj.imagen_terciaria)
