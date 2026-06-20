from django.db import models
from django.utils.text import slugify
from decimal import Decimal
from PIL import Image
import io
import base64

TASA_USD_PEN = Decimal("3.5")


def to_decimal(value):
    try:
        if value is None:
            return Decimal("0.00")
        value = str(value).strip()
        if value == "":
            return Decimal("0.00")
        return Decimal(value)
    except:
        return Decimal("0.00")


def compress_image(binary_data, mime_type):
    if not binary_data:
        return None, None

    try:
        image = Image.open(io.BytesIO(binary_data))

        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")

        max_size = 800
        image.thumbnail((max_size, max_size))

        buffer = io.BytesIO()
        image.save(buffer, format="JPEG", quality=70, optimize=True)
        compressed_bytes = buffer.getvalue()

        base64_str = base64.b64encode(compressed_bytes).decode("utf-8")
        final_data = f"data:image/jpeg;base64,{base64_str}"

        return final_data, "image/jpeg"

    except Exception as e:
        print("❌ Error comprimiendo imagen:", e)
        return None, None


class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre


class Subcategoria(models.Model):
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.CASCADE,
        related_name="subcategorias",
    )
    nombre = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True, blank=True)

    class Meta:
        unique_together = ("categoria", "nombre")

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.nombre)
            slug = base_slug
            contador = 1
            while Subcategoria.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{contador}"
                contador += 1
            self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.categoria.nombre} → {self.nombre}"


class Producto(models.Model):
    sku = models.CharField(max_length=50, unique=True)
    nombre = models.CharField(max_length=200)
    marca = models.CharField(max_length=100, blank=True, null=True)

    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="productos",
    )

    subcategoria = models.ForeignKey(
        Subcategoria,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="productos",
    )

    descripcion = models.TextField(blank=True, null=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)

    costo_compra = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    taxes = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    precio_importacion = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    precio_venta_soles = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    precio_mercado_soles = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    stock = models.IntegerField(default=0)

    activo = models.BooleanField(default=True)
    destacado = models.BooleanField(default=False)

    valor_total_unidad = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    valor_general = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    precio_venta_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    ganancia_unidad = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    ganancia_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    descuento_soles = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    descuento_porcentaje = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    imagen_principal = models.BinaryField(null=True, blank=True)
    imagen_principal_mime = models.CharField(max_length=50, null=True, blank=True)

    imagen_secundaria = models.BinaryField(null=True, blank=True)
    imagen_secundaria_mime = models.CharField(max_length=50, null=True, blank=True)

    imagen_terciaria = models.BinaryField(null=True, blank=True)
    imagen_terciaria_mime = models.CharField(max_length=50, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.nombre)
            slug = base_slug
            contador = 1
            while Producto.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{contador}"
                contador += 1
            self.slug = slug

        if self.imagen_principal:
            data, mime = compress_image(self.imagen_principal, self.imagen_principal_mime)
            self.imagen_principal = data
            self.imagen_principal_mime = mime

        if self.imagen_secundaria:
            data, mime = compress_image(self.imagen_secundaria, self.imagen_secundaria_mime)
            self.imagen_secundaria = data
            self.imagen_secundaria_mime = mime

        if self.imagen_terciaria:
            data, mime = compress_image(self.imagen_terciaria, self.imagen_terciaria_mime)
            self.imagen_terciaria = data
            self.imagen_terciaria_mime = mime

        costo = to_decimal(self.costo_compra)
        taxes = to_decimal(self.taxes)
        imp = to_decimal(self.precio_importacion)
        venta_soles = to_decimal(self.precio_venta_soles)
        mercado_soles = to_decimal(self.precio_mercado_soles)

        self.valor_total_unidad = (costo + taxes + imp).quantize(Decimal("0.01"))
        self.valor_general = (self.valor_total_unidad * Decimal(self.stock)).quantize(Decimal("0.01"))
        self.precio_venta_usd = (venta_soles / TASA_USD_PEN).quantize(Decimal("0.01"))
        self.ganancia_unidad = (self.precio_venta_usd - self.valor_total_unidad).quantize(Decimal("0.01"))
        self.ganancia_total = (self.ganancia_unidad * Decimal(self.stock)).quantize(Decimal("0.01"))

        if mercado_soles > 0:
            self.descuento_soles = (mercado_soles - venta_soles).quantize(Decimal("0.01"))
            self.descuento_porcentaje = ((self.descuento_soles / mercado_soles) * 100).quantize(Decimal("0.01"))
        else:
            self.descuento_soles = Decimal("0.00")
            self.descuento_porcentaje = Decimal("0.00")

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.sku} - {self.nombre}"
