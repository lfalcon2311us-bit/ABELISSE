from django.contrib import admin
from django import forms
from django.utils.html import format_html

from .models import Categoria, Subcategoria, Producto


# ---------------------------------------------------------
# ADMIN DE CATEGORÍAS
# ---------------------------------------------------------
@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ("nombre", "slug")
    search_fields = ("nombre",)
    prepopulated_fields = {"slug": ("nombre",)}


# ---------------------------------------------------------
# ADMIN DE SUBCATEGORÍAS
# ---------------------------------------------------------
@admin.register(Subcategoria)
class SubcategoriaAdmin(admin.ModelAdmin):
    list_display = ("nombre", "categoria", "slug")
    list_filter = ("categoria",)
    search_fields = ("nombre",)
    prepopulated_fields = {"slug": ("nombre",)}


# ---------------------------------------------------------
# FORMULARIO PERSONALIZADO PARA PRODUCTOS
# ---------------------------------------------------------
class ProductoForm(forms.ModelForm):
    imagen_principal_file = forms.FileField(required=False, label="Imagen principal")
    imagen_secundaria_file = forms.FileField(required=False, label="Imagen secundaria")
    imagen_terciaria_file = forms.FileField(required=False, label="Imagen terciaria")

    class Meta:
        model = Producto
        fields = "__all__"

    def save(self, commit=True):
        producto = super().save(commit=False)

        # Imagen principal
        file = self.cleaned_data.get("imagen_principal_file")
        if file:
            producto.imagen_principal = file.read()
            producto.imagen_principal_mime = file.content_type

        # Imagen secundaria
        file = self.cleaned_data.get("imagen_secundaria_file")
        if file:
            producto.imagen_secundaria = file.read()
            producto.imagen_secundaria_mime = file.content_type

        # Imagen terciaria
        file = self.cleaned_data.get("imagen_terciaria_file")
        if file:
            producto.imagen_terciaria = file.read()
            producto.imagen_terciaria_mime = file.content_type

        if commit:
            producto.save()
        return producto


# ---------------------------------------------------------
# ADMIN DE PRODUCTOS
# ---------------------------------------------------------
@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    form = ProductoForm

    list_display = (
        "sku",
        "nombre",
        "marca",
        "precio_venta_soles",
        "activo",
        "destacado",
        "preview_principal",
    )

    list_filter = ("activo", "destacado", "categoria", "subcategoria", "marca")
    search_fields = ("sku", "nombre", "marca")

    fieldsets = (
        ("Información del producto", {
            "fields": (
                "verificacion_katy",
                "cantidad_recibida",
                "sku",
                "marca",
                "nombre",
                "slug",
                "descripcion",
                "tamano",
                "categoria",
                "subcategoria",
                "stock",
            )
        }),

        ("Precios y costos (editables)", {
            "fields": (
                "costo_compra",
                "taxes",
                "precio_importacion",
                "precio_venta_usd",
                "precio_venta_soles",
                "precio_mercado_soles",
            )
        }),

        ("Contabilidad (calculado por el backend)", {
            "fields": (
                "valor_total_unidad",
                "valor_general",
                "descuento_soles",
                "descuento_porcentaje",
                "ganancia_unidad",
                "ganancia_total",
            )
        }),

        ("Imágenes del producto", {
            "fields": (
                "preview_principal",
                "imagen_principal_file",
                "preview_secundaria",
                "imagen_secundaria_file",
                "preview_terciaria",
                "imagen_terciaria_file",
            )
        }),

        ("Estado y analítica", {
            "fields": (
                "destacado",
                "activo",
                "ventas_totales",
                "busquedas_totales",
                "calificacion_promedio",
                "total_calificaciones",
            )
        }),
    )

    readonly_fields = (
        "preview_principal",
        "preview_secundaria",
        "preview_terciaria",
        "slug",
        "valor_total_unidad",
        "valor_general",
        "descuento_soles",
        "descuento_porcentaje",
        "ganancia_unidad",
        "ganancia_total",
        "ventas_totales",
        "busquedas_totales",
        "calificacion_promedio",
        "total_calificaciones",
    )

    # ---------------------------------------------------------
    # PREVIEWS DE IMÁGENES
    # ---------------------------------------------------------
    def _preview(self, data):
        if not data:
            return "Sin imagen"
        if isinstance(data, str) and data.startswith("data:image"):
            return format_html(
                '<img src="{}" width="150" style="border-radius:8px;" />',
                data
            )
        return "Sin imagen"

    def preview_principal(self, obj):
        return self._preview(obj.imagen_principal)

    def preview_secundaria(self, obj):
        return self._preview(obj.imagen_secundaria)

    def preview_terciaria(self, obj):
        return self._preview(obj.imagen_terciaria)
