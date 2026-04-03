from django.db import models
from django.utils.text import slugify
from decimal import Decimal

TASA_USD_PEN = Decimal("3.5")


class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre


class Producto(models.Model):

    # --- Verificación logística ---
    VERIFICACION_CHOICES = [
        ('recibido', 'Recibido'),
        ('no_recibido', 'No recibido'),
    ]
    verificacion_katy = models.CharField(
        max_length=20,
        choices=VERIFICACION_CHOICES,
        default='no_recibido'
    )

    # Cantidad que realmente llegó (solo aplica si verificacion_katy = no_recibido)
    cantidad_recibida = models.PositiveIntegerField(default=0)

    # --- Identificación ---
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
    subcategoria = models.CharField(max_length=100, blank=True, null=True)

    # --- Stock ---
    stock = models.PositiveIntegerField(default=0)

    # --- Costos (USD) ---
    costo_compra = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    taxes = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    precio_importacion = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # --- Cálculos automáticos (USD) ---
    valor_total_unidad = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    valor_general = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # --- Precios de venta ---
    precio_venta_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    precio_venta_soles = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Renombrado según tu instrucción
    precio_mercado_soles = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    # --- Descuentos ---
    descuento_soles = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    descuento_porcentaje = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    # --- Ganancias ---
    ganancia_unidad = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    ganancia_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # --- Imágenes ---
    imagen_principal = models.URLField(max_length=500, blank=True, null=True)
    imagen_secundaria = models.URLField(max_length=500, blank=True, null=True)
    imagen_terciaria = models.URLField(max_length=500, blank=True, null=True)

    # --- Estado del producto ---
    destacado = models.BooleanField(default=False)
    activo = models.BooleanField(default=True)

    # --- Analítica ---
    ventas_totales = models.IntegerField(default=0)
    busquedas_totales = models.IntegerField(default=0)
    calificacion_promedio = models.FloatField(default=0)
    total_calificaciones = models.IntegerField(default=0)

    # --- Fechas ---
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

        # VALOR TOTAL POR UNIDAD
        self.valor_total_unidad = (
            self.costo_compra + self.taxes + self.precio_importacion
        ).quantize(Decimal("0.01"))

        # VALOR GENERAL
        self.valor_general = (self.valor_total_unidad * self.stock).quantize(
            Decimal("0.01")
        )

        # PRECIO VENTA USD DESDE SOLES
        if self.precio_venta_soles and self.precio_venta_soles > 0:
            self.precio_venta_usd = (
                self.precio_venta_soles / TASA_USD_PEN
            ).quantize(Decimal("0.01"))
        else:
            self.precio_venta_usd = Decimal("0.00")

        # GANANCIAS
        self.ganancia_unidad = (
            self.precio_venta_usd - self.valor_total_unidad
        ).quantize(Decimal("0.01"))
        self.ganancia_total = (self.ganancia_unidad * self.stock).quantize(
            Decimal("0.01")
        )

        # DESCUENTOS
        if (
            self.precio_mercado_soles
            and self.precio_mercado_soles > 0
            and self.precio_venta_soles > 0
        ):
            self.descuento_soles = (
                self.precio_mercado_soles - self.precio_venta_soles
            ).quantize(Decimal("0.01"))
            self.descuento_porcentaje = (
                (self.descuento_soles / self.precio_mercado_soles) * 100
            ).quantize(Decimal("0.01"))
        else:
            self.descuento_soles = Decimal("0.00")
            self.descuento_porcentaje = Decimal("0.00")

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.sku} - {self.nombre}"
