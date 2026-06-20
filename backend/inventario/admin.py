from django.contrib import admin
from django import forms
from django.utils.html import format_html
import base64

from .models import Categoria, Subcategoria, Producto


# ---------------------------------------------------------
#  FORMULARIO PERSONALIZADO PARA SUBIR IMÁGENES
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
            producto.imagen_principal = file.read()  # binario crudo
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
            producto.save()  # aquí se activa la compresión automática del modelo
        return producto


# ---------------------------------------------------------
#  ADMIN PERSONALIZADO PARA MOSTRAR PREVIEW DE IMÁGENES
# ---------------------------------------------------------
@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    form = ProductoForm

    list_display = (
        "sku",
        "nombre",
        "marca",
        "categoria",
        "subcategoria",
        "precio_venta_soles",
        "activo",
        "destacado",
        "preview_principal",
    )

    list_filter = ("categoria", "subcategoria", "activo", "destacado")
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

        ("Precios y costos", {
            "fields": (
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
    )

    # ---------------------------------------------------------
    #  PREVIEWS DE IMÁGENES (BASE64 YA COMPRIMIDO)
    # ---------------------------------------------------------
    def _preview(self, data):
        """
        Ahora las imágenes YA están en base64 desde el modelo.
        Solo devolvemos la cadena si es válida.
        """
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
    preview_principal.short_description = "Vista previa principal"

    def preview_secundaria(self, obj):
        return self._preview(obj.imagen_secundaria)
    preview_secundaria.short_description = "Vista previa secundaria"

    def preview_terciaria(self, obj):
        return self._preview(obj.imagen_terciaria)
    preview_terciaria.short_description = "Vista previa terciaria"


# ---------------------------------------------------------
#  ADMIN DE CATEGORÍA Y SUBCATEGORÍA
# ---------------------------------------------------------
@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ("nombre", "slug")
    prepopulated_fields = {"slug": ("nombre",)}


@admin.register(Subcategoria)
class SubcategoriaAdmin(admin.ModelAdmin):
    list_display = ("nombre", "categoria", "slug")
    list_filter = ("categoria",)
    prepopulated_fields = {"slug": ("nombre",)}
