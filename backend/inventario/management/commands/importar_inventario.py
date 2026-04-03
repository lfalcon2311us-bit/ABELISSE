import csv
from decimal import Decimal
from django.core.management.base import BaseCommand
from inventario.models import Producto, Categoria

TASA_USD_PEN = Decimal("3.5")


def limpiar_valor(valor):
    if not valor or str(valor).strip() == "" or "DIV" in str(valor):
        return Decimal("0")

    valor = str(valor).replace("$", "").replace("S/", "").replace(",", "").strip()
    try:
        return Decimal(valor)
    except:
        return Decimal("0")


def limpiar_entero(valor):
    try:
        return int(str(valor).replace(",", "").strip())
    except:
        return 0


class Command(BaseCommand):
    help = "Importa productos desde inventario_utf8.csv"

    def add_arguments(self, parser):
        parser.add_argument(
            "archivo_csv",
            type=str,
            nargs="?",
            default="inventario_utf8.csv",
            help="Ruta del archivo CSV (por defecto inventario_utf8.csv)"
        )

    def handle(self, *args, **kwargs):
        archivo = kwargs["archivo_csv"]

        # LECTOR UNIVERSAL (UTF-8, BOM, LATIN-1, WINDOWS-1252)
        try:
            f = open(archivo, newline="", encoding="utf-8")
            f.read(1)
            f.seek(0)
        except:
            try:
                f = open(archivo, newline="", encoding="utf-8-sig")
            except:
                f = open(archivo, newline="", encoding="latin-1", errors="ignore")

        reader = csv.DictReader(f)

        for row in reader:
            sku = row["ID de inventario"].strip()
            nombre = row["Nombre"].strip()
            marca = row["Marca"].strip() if row["Marca"] else ""
            descripcion = row["Descripción "].strip() if row["Descripción "] else ""
            tamano = row["Tamaño"].strip() if row["Tamaño"] else ""

            # STOCK
            stock = limpiar_entero(row["Cantidad  en existencias"])

            # USD BASE
            costo_compra = limpiar_valor(row["Costo de compra "])
            taxes = limpiar_valor(row["Taxes "])
            precio_importacion = limpiar_valor(row["Precio de importación "])

            # VALOR TOTAL POR UNIDAD
            valor_total_unidad = costo_compra + taxes + precio_importacion

            # VALOR GENERAL DE MERCADERÍA DISPONIBLE
            valor_general = valor_total_unidad * stock

            # PRECIOS EN SOLES
            precio_venta_soles = limpiar_valor(row["Precio de venta peru x unidad en soles"])
            precio_mercado = limpiar_valor(row["Precio del mercado"])

            # PRECIO VENTA USD (DESDE SOLES)
            if precio_venta_soles > 0:
                precio_venta_usd = (precio_venta_soles / TASA_USD_PEN).quantize(Decimal("0.01"))
            else:
                precio_venta_usd = Decimal("0")

            # DESCUENTOS
            if precio_mercado > 0 and precio_venta_soles > 0:
                descuento_soles = precio_mercado - precio_venta_soles
                descuento_porcentaje = (descuento_soles / precio_mercado * 100).quantize(Decimal("0.01"))
            else:
                descuento_soles = Decimal("0")
                descuento_porcentaje = Decimal("0")

            # GANANCIAS
            ganancia_unidad = (precio_venta_usd - valor_total_unidad).quantize(Decimal("0.01"))
            ganancia_total = (ganancia_unidad * stock).quantize(Decimal("0.01"))

            # CATEGORÍA
            categoria_nombre = marca if marca else "Sin categoría"
            categoria, _ = Categoria.objects.get_or_create(nombre=categoria_nombre)

            Producto.objects.update_or_create(
                sku=sku,
                defaults={
                    "nombre": nombre,
                    "marca": marca,
                    "descripcion": descripcion,
                    "tamano": tamano,
                    "stock": stock,

                    "costo_compra": costo_compra,
                    "taxes": taxes,
                    "precio_importacion": precio_importacion,
                    "valor_total_unidad": valor_total_unidad,
                    "valor_general": valor_general,
                    "precio_venta_usd": precio_venta_usd,

                    "precio_venta_soles": precio_venta_soles,
                    "precio_mercado": precio_mercado,
                    "descuento_soles": descuento_soles,
                    "descuento_porcentaje": descuento_porcentaje,

                    "ganancia_unidad": ganancia_unidad,
                    "ganancia_total": ganancia_total,

                    "categoria": categoria,
                    "activo": True,
                }
            )

        f.close()
        self.stdout.write(self.style.SUCCESS("Inventario importado correctamente."))
