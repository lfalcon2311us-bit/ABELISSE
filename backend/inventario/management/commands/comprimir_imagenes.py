import io
from django.core.management.base import BaseCommand
from django.db import transaction

from PIL import Image

from inventario.models import Producto


MAX_WIDTH = 800
JPEG_QUALITY = 75


def compress_image(binary_data, mime_type):
  """
  Recibe binario + mime, devuelve binario comprimido en JPEG.
  Si algo falla, devuelve el original.
  """
  if not binary_data or not mime_type:
    return binary_data, mime_type

  try:
    # Abrir imagen desde binario
    img = Image.open(io.BytesIO(binary_data))

    # Convertir a RGB (por si viene en PNG con transparencia)
    if img.mode in ("RGBA", "P"):
      img = img.convert("RGB")

    # Redimensionar si es muy grande
    width, height = img.size
    if width > MAX_WIDTH:
      new_height = int(height * (MAX_WIDTH / width))
      img = img.resize((MAX_WIDTH, new_height), Image.LANCZOS)

    # Guardar en memoria como JPEG comprimido
    output = io.BytesIO()
    img.save(output, format="JPEG", quality=JPEG_QUALITY, optimize=True)
    compressed_data = output.getvalue()

    return compressed_data, "image/jpeg"

  except Exception as e:
    print("⚠ Error comprimiendo imagen:", e)
    return binary_data, mime_type


class Command(BaseCommand):
  help = "Comprime todas las imágenes existentes de productos (principal, secundaria, terciaria)."

  def handle(self, *args, **options):
    self.stdout.write(self.style.WARNING("Iniciando compresión de imágenes de productos..."))

    productos = Producto.objects.all()
    total = productos.count()
    procesados = 0

    with transaction.atomic():
      for producto in productos:
        cambiado = False

        # Imagen principal
        if producto.imagen_principal and producto.imagen_principal_mime:
          nueva, nuevo_mime = compress_image(
            producto.imagen_principal,
            producto.imagen_principal_mime,
          )
          if nueva != producto.imagen_principal:
            producto.imagen_principal = nueva
            producto.imagen_principal_mime = nuevo_mime
            cambiado = True

        # Imagen secundaria
        if producto.imagen_secundaria and producto.imagen_secundaria_mime:
          nueva, nuevo_mime = compress_image(
            producto.imagen_secundaria,
            producto.imagen_secundaria_mime,
          )
          if nueva != producto.imagen_secundaria:
            producto.imagen_secundaria = nueva
            producto.imagen_secundaria_mime = nuevo_mime
            cambiado = True

        # Imagen terciaria
        if producto.imagen_terciaria and producto.imagen_terciaria_mime:
          nueva, nuevo_mime = compress_image(
            producto.imagen_terciaria,
            producto.imagen_terciaria_mime,
          )
          if nueva != producto.imagen_terciaria:
            producto.imagen_terciaria = nueva
            producto.imagen_terciaria_mime = nuevo_mime
            cambiado = True

        if cambiado:
          producto.save()
          procesados += 1
          self.stdout.write(f"✔ Producto {producto.id} ({producto.sku}) comprimido.")

    self.stdout.write(self.style.SUCCESS(
      f"Proceso terminado. Productos procesados: {procesados} de {total}."
    ))
