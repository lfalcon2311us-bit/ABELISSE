from rest_framework import serializers
from .models import Categoria, Producto


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = "__all__"


class ProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)

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
            "precio_mercado_soles",   # ← 🔥 FIX REAL
            "descuento_soles",
            "descuento_porcentaje",
            "ganancia_unidad",
            "ganancia_total",
            "imagen_principal",
            "imagen_secundaria",
            "imagen_terciaria",
            "destacado",
            "activo",

            # 🔥 Campos nuevos para analítica
            "ventas_totales",
            "busquedas_totales",
            "calificacion_promedio",
            "total_calificaciones",

            "fecha_creacion",
            "fecha_actualizacion",
        ]
