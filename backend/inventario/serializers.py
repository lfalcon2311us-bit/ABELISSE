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

    # 🔥 URLs limpias para las imágenes
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

            # 🔥 URLs generadas dinámicamente
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
    # 🔥 MÉTODOS PARA GENERAR LAS URLs DE IMAGEN
    # ---------------------------------------------------------
    def get_imagen_principal(self, obj):
        if obj.imagen_principal:
            return f"/api/productos/{obj.id}/imagen/principal/"
        return None

    def get_imagen_secundaria(self, obj):
        if obj.imagen_secundaria:
            return f"/api/productos/{obj.id}/imagen/secundaria/"
        return None

    def get_imagen_terciaria(self, obj):
        if obj.imagen_terciaria:
            return f"/api/productos/{obj.id}/imagen/terciaria/"
        return None
