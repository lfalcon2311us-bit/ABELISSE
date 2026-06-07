import base64
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

    # 🔥 Convertimos las imágenes binario → base64
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

            # 🔥 Imágenes convertidas a base64
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
    # 🔥 MÉTODOS PARA CONVERTIR BINARIO → BASE64
    # ---------------------------------------------------------
    def _convert_image(self, binary_data, mime_type):
        if not binary_data or not mime_type:
            return None

        base64_data = base64.b64encode(binary_data).decode("utf-8")
        return f"data:{mime_type};base64,{base64_data}"

    def get_imagen_principal(self, obj):
        return self._convert_image(obj.imagen_principal, obj.imagen_principal_mime)

    def get_imagen_secundaria(self, obj):
        return self._convert_image(obj.imagen_secundaria, obj.imagen_secundaria_mime)

    def get_imagen_terciaria(self, obj):
        return self._convert_image(obj.imagen_terciaria, obj.imagen_terciaria_mime)
