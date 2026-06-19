import Image from "next/image";
import { safeFetch, API_URL } from "@/lib/api";

// 🔥 Normaliza y limpia el ID
function limpiarId(raw: string): string | null {
  if (!raw) return null;

  const limpio = raw.split("?")[0].split("&")[0].trim();

  return /^\d+$/.test(limpio) ? limpio : null;
}

async function getProductoSeguro(id: string) {
  const url = `${API_URL}/productos/${id}/`;

  try {
    return await safeFetch(
      url,
      { method: "GET" },
      {
        file: "app/productos/[id]/page.tsx",
        functionName: "getProducto",
        route: `/productos/${id}`,
      }
    );
  } catch (error) {
    console.error("❌ safeFetch falló:", error);

    try {
      const res = await fetch(url, { cache: "force-cache" });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error("❌ Fallback fetch también falló:", e);
      return null;
    }
  }
}

export default async function ProductoPage({ params }: { params: { id: string } }) {
  const id = limpiarId(params.id);

  if (!id) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-center">Producto no válido</h1>
        <p className="text-center mt-4 text-gray-500">
          El ID del producto no es válido.
        </p>
      </main>
    );
  }

  const producto = await getProductoSeguro(id);

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

  const imagenes = [
    producto.imagen_principal,
    producto.imagen_secundaria,
    producto.imagen_terciaria,
  ].filter((img) => typeof img === "string" && img.length > 20);

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">{producto.nombre}</h1>

      <div className="space-y-4">
        {imagenes.map((img, i) => (
          <Image
            key={i}
            src={img}
            alt={producto.nombre}
            width={800}
            height={800}
            unoptimized
            className="w-full rounded-xl object-cover"
          />
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <p className="text-gray-700">{producto.descripcion}</p>

        <p><strong>Marca:</strong> {producto.marca}</p>
        <p><strong>Tamaño:</strong> {producto.tamano}</p>
        <p><strong>Precio:</strong> S/ {producto.precio_venta_soles}</p>
        <p><strong>Categoría:</strong> {producto.categoria?.nombre}</p>
        <p><strong>Subcategoría:</strong> {producto.subcategoria?.nombre}</p>
      </div>
    </main>
  );
}
