from django.db import models
from django.utils.text import slugify
from decimal import Decimal

TASA_USD_PEN = Decimal("3.5")


def to_decimal(value):
    if value is None:
        return Decimal("0.00")
    if isinstance(value, Decimal):
        return value
    try:
        return Decimal(str(value))
    except:
        return Decimal("0.00")


# ---------------------------------------------------------
#  CATEGORÍA PRINCIPAL
# ---------------------------------------------------------
class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre


# ---------------------------------------------------------
#  SUBCATEGORÍA
# ---------------------------------------------------------
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
        verbose_name = "Subcategoría"
        verbose_name_plural = "Subcategorías"

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


# ---------------------------------------------------------
#  PRODUCTO
# ---------------------------------------------------------
class Producto(models.Model):

    VERIFICACION_CHOICES = [
        ('recibido', 'Recibido'),
        ('no_recibido', 'No recibido'),
    ]

    verificacion_katy = models.CharField(
        max_length=20,
        choices=VERIFICACION_CHOICES,
        default='no_recibido'
    )

    cantidad_recibida = models.PositiveIntegerField(default=0)

    # Identificación
    sku = models.CharField(max_length=50, unique=True)
    marca = models.CharField(max_length=100, blank=True, null=True)
    nombre = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    descripcion = models.TextField(blank=True, null=True)
    tamano = models.CharField(max_length=100, blank=True, null=True)

    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.SET_NULL,
        null=True,
        related_name="productos",
    )

    subcategoria = models.ForeignKey(
        Subcategoria,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="productos",
    )

    # Stock
    stock = models.PositiveIntegerField(default=0)

    # Costos (USD)
    costo_compra = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    taxes = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    precio_importacion = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Cálculos automáticos (USD)
    valor_total_unidad = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    valor_general = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Precios de venta
    precio_venta_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    precio_venta_soles = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    precio_mercado_soles = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    # Descuentos
    descuento_soles = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    descuento_porcentaje = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    # Ganancias
    ganancia_unidad = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    ganancia_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Imágenes
    imagen_principal = models.URLField(max_length=500, blank=True, null=True)
    imagen_secundaria = models.URLField(max_length=500, blank=True, null=True)
    imagen_terciaria = models.URLField(max_length=500, blank=True, null=True)

    # Estado
    destacado = models.BooleanField(default=False)
    activo = models.BooleanField(default=True)

    # Analítica
    ventas_totales = models.IntegerField(default=0)
    busquedas_totales = models.IntegerField(default=0)
    calificacion_promedio = models.FloatField(default=0)
    total_calificaciones = models.IntegerField(default=0)

    # Fechas
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):

        # SLUG ÚNICO
        if not self.slug:
            base_slug = slugify(self.nombre)
            slug = base_slug
            contador = 1
            while Producto.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{contador}"
                contador += 1
            self.slug = slug

        # Convertir todo a Decimal de forma segura
        costo = to_decimal(self.costo_compra)
        taxes = to_decimal(self.taxes)
        imp = to_decimal(self.precio_importacion)
        venta_soles = to_decimal(self.precio_venta_soles)
        mercado_soles = to_decimal(self.precio_mercado_soles)

        # VALOR TOTAL POR UNIDAD
        self.valor_total_unidad = (costo + taxes + imp).quantize(Decimal("0.01"))

        # VALOR GENERAL
        self.valor_general = (self.valor_total_unidad * Decimal(self.stock)).quantize(Decimal("0.01"))

        # PRECIO VENTA USD
        if venta_soles > 0:
            self.precio_venta_usd = (venta_soles / TASA_USD_PEN).quantize(Decimal("0.01"))
        else:
            self.precio_venta_usd = Decimal("0.00")

        # GANANCIAS
        self.ganancia_unidad = (self.precio_venta_usd - self.valor_total_unidad).quantize(Decimal("0.01"))
        self.ganancia_total = (self.ganancia_unidad * Decimal(self.stock)).quantize(Decimal("0.01"))

        # DESCUENTOS
        if mercado_soles > 0 and venta_soles > 0:
            self.descuento_soles = (mercado_soles - venta_soles).quantize(Decimal("0.01"))
            self.descuento_porcentaje = ((self.descuento_soles / mercado_soles) * 100).quantize(Decimal("0.01"))
        else:
            self.descuento_soles = Decimal("0.00")
            self.descuento_porcentaje = Decimal("0.00")

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.sku} - {self.nombre}"
