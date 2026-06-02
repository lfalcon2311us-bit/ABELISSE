from django.contrib import admin
from .models import Categoria, Subcategoria, Producto


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ("nombre", "slug")
    prepopulated_fields = {"slug": ("nombre",)}


@admin.register(Subcategoria)
class SubcategoriaAdmin(admin.ModelAdmin):
    list_display = ("nombre", "categoria", "slug")
    list_filter = ("categoria",)
    prepopulated_fields = {"slug": ("nombre",)}


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ("sku", "nombre", "marca", "categoria", "subcategoria", "precio_venta_soles", "activo", "destacado")
    list_filter = ("categoria", "subcategoria", "activo", "destacado")
    search_fields = ("sku", "nombre", "marca")
