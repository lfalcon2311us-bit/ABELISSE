export const dynamic = "force-dynamic";

import Image from "next/image";
import CarouselProducto from "./carousel";

async function getProducto(id: string) {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (!backend) return null;

  // Eliminar slash final si existe
  const clean = backend.replace(/\/$/, "");

  try {
    const res = await fetch(`${clean}/api/productos/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching producto:", error);
    return null;
  }
}

export default async function ProductoPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const producto = await getProducto(id);

  if (!producto) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold">Producto no encontrado</h1>
      </main>
    );
  }

  // Filtrar imágenes válidas
  const imagenes = [
    producto.imagen_principal,
    producto.imagen_secundaria,
    producto.imagen_terciaria,
  ].filter((img) => typeof img === "string" && img.trim().length > 10);

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-4">{producto.nombre}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Carrusel seguro */}
        {imagenes.length > 0 ? (
          <CarouselProducto imagenes={imagenes} nombre={producto.nombre} />
        ) : (
          <div className="w-full h-80 bg-gray-100 flex items-center justify-center rounded-lg">
            <span className="text-gray-500">Sin imágenes disponibles</span>
          </div>
        )}

        <div>
          <p className="text-2xl font-bold text-pink-600 mb-4">
            S/ {producto.precio_venta_soles}
          </p>

          <p className="text-gray-700 mb-8 leading-relaxed">
            {producto.descripcion || "Sin descripción disponible."}
          </p>
        </div>
      </div>
    </main>
  );
}
