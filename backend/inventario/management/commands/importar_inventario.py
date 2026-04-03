import csv
from decimal import Decimal
from django.core.management.base import BaseCommand
from inventario.models import Producto, Categoria


def limpiar_decimal(valor):
    """
    Limpia valores como:
    '$34.00', 'S/ 230.00', ' 15.20 ', '(1.60)', '0', ''
    y los convierte en Decimal.
    """
    if not valor or str(valor).strip() == "":
        return Decimal("0")

    texto = str(valor).strip()

    # Manejar negativos tipo (1.60)
    negativo = False
    if texto.startswith("(") and texto.endswith(")"):
        negativo = True
        texto = texto[1:-1]

    # Quitar símbolos
    texto = (
        texto.replace("$", "")
        .replace("S/", "")
        .replace("s/", "")
        .replace(",", "")
        .strip()
    )

    if texto == "":
        return Decimal("0")

    numero = Decimal(texto)
    return -numero if negativo else numero


class Command(BaseCommand):
    help = "Importa o actualiza productos desde inventario.csv"

    def add_arguments(self, parser):
        parser.add_argument(
            "ruta_csv",
            type=str,
            help="Ruta al archivo CSV de inventario"
        )

    def handle(self, *args, **options):
        ruta_csv = options["ruta_csv"]

        self.stdout.write(self.style.WARNING(f"Usando archivo: {ruta_csv}"))

        # 🔥 APERTURA ROBUSTA DEL ARCHIVO (UTF-8 → UTF-8-SIG → LATIN-1)
        try:
            f = open(ruta_csv, newline="", encoding="utf-8")
            f.read(1)
            f.seek(0)
        except:
            try:
                f = open(ruta_csv, newline="", encoding="utf-8-sig")
                f.read(1)
                f.seek(0)
            except:
                f = open(ruta_csv, newline="", encoding="latin-1", errors="ignore")

        reader = csv.reader(f)

        encabezados_encontrados = False

        for fila in reader:

            # Saltar filas vacías
            if not any(fila):
                continue

            # Detectar encabezados reales
            if not encabezados_encontrados:
                if len(fila) > 2 and "ID de inventario" in fila[2]:
                    encabezados_encontrados = True
                continue

            # A partir de aquí son filas de datos
            if len(fila) < 19:
                continue

            (
                volver_a_pedir,      # 0
                verificacion_csv,    # 1 (no lo usamos)
                sku,                 # 2
                marca,               # 3
                nombre,              # 4
                descripcion,         # 5
                tamano,              # 6
                cantidad_existencias,# 7
                costo_compra,        # 8
                taxes,               # 9
                precio_importacion,  # 10
                valor_total_csv,     # 11 (no se usa)
                valor_general_csv,   # 12 (no se usa)
                precio_venta_usd_csv,# 13 (no se usa)
                precio_venta_soles,  # 14
                precio_mercado,      # 15
                columna_vacia,       # 16
                ganancia_unidad_csv, # 17 (no se usa)
                ganancia_total_csv,  # 18 (no se usa)
            ) = fila[:19]

            if not sku:
                continue

            # Limpieza de datos
            stock = int(cantidad_existencias.strip() or "0")

            costo_compra_dec = limpiar_decimal(costo_compra)
            taxes_dec = limpiar_decimal(taxes)
            precio_importacion_dec = limpiar_decimal(precio_importacion)
            precio_venta_soles_dec = limpiar_decimal(precio_venta_soles)
            precio_mercado_soles_dec = limpiar_decimal(precio_mercado)

            # Categoría automática por marca
            categoria_nombre = marca.strip() if marca else "Sin categoría"
            categoria, _ = Categoria.objects.get_or_create(nombre=categoria_nombre)

            # Crear o actualizar producto
            producto, creado = Producto.objects.get_or_create(sku=sku.strip())

            producto.marca = marca.strip() if marca else ""
            producto.nombre = nombre.strip() if nombre else ""
            producto.descripcion = descripcion.strip() if descripcion else ""
            producto.tamano = tamano.strip() if tamano else ""

            producto.stock = stock

            producto.costo_compra = costo_compra_dec
            producto.taxes = taxes_dec
            producto.precio_importacion = precio_importacion_dec

            producto.precio_venta_soles = precio_venta_soles_dec
            producto.precio_mercado_soles = precio_mercado_soles_dec

            producto.categoria = categoria

            # Logística
            producto.verificacion_katy = "no_recibido"
            producto.cantidad_recibida = 0

            # El modelo calcula todo lo demás automáticamente
            producto.save()

            accion = "CREADO" if creado else "ACTUALIZADO"
            self.stdout.write(self.style.SUCCESS(f"{accion}: {sku} - {producto.nombre}"))

        f.close()
        self.stdout.write(self.style.SUCCESS("Importación completada."))
