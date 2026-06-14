export const dynamic = "force-dynamic";

import Image from "next/image";
import { safeFetch, API_URL } from "@/lib/api";
import CarouselProducto from "./carousel";

async function getProducto(id: string) {
  const url = `${API_URL}/productos/${id}/`;

  const data = await safeFetch(
    url,
    { method: "GET" },
    {
      file: "app/productos/[id]/page.tsx",
      functionName: "getProducto",
      route: `/productos/${id}`,
    }
  );

  return data;
}

export default async function ProductoPage({ params }: { params: { id: string } }) {
  const { id } = params;

  let producto = null;

  try {
    producto = await getProducto(id);
  } catch (error) {
    console.error("❌ Error cargando producto:", error);
  }

  if (!producto) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-center">Producto no encontrado</h1>
        <p className="text-center mt-4 text-gray-500">
          No pudimos cargar la información del producto.
        </p>
      </main>
    );
  }

  // Construir array de imágenes válidas
  const imagenes = [
    producto.imagen_principal,
    producto.imagen_secundaria,
    producto.imagen_terciaria,
  ].filter((img) => typeof img === "string" && img.length > 20);

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">{producto.nombre}</h1>

      {/* Carrusel de imágenes */}
      <CarouselProducto
        imagenes={imagenes}
        nombre={producto.nombre}
      />

      {/* Información del producto */}
      <div className="mt-8 space-y-4">
        <p className="text-gray-700">{producto.descripcion}</p>

        <p>
          <strong>Marca:</strong> {producto.marca}
        </p>

        <p>
          <strong>Tamaño:</strong> {producto.tamano}
        </p>

        <p>
          <strong>Precio:</strong> S/ {producto.precio_venta_soles}
        </p>

        <p>
          <strong>Categoría:</strong> {producto.categoria?.nombre}
        </p>

        <p>
          <strong>Subcategoría:</strong> {producto.subcategoria?.nombre}
        </p>
      </div>
    </main>
  );
}
