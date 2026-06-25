import { safeFetch, API_URL } from "@/lib/api";
import ProductoClient from "./ProductoClient";

// Normaliza y limpia el ID
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
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error("❌ Fallback fetch también falló:", e);
      return null;
    }
  }
}

interface ProductoPageProps {
  params: { id: string };
}

export default async function ProductoPage({ params }: ProductoPageProps) {
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

  return <ProductoClient producto={producto} />;
}
