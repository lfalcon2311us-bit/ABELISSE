"use client";

import { useEffect, useState } from "react";
import ProductCardPremium from "@/components/ProductCardPremium";
import { safeFetch, API_URL } from "@/lib/api";

export default function CategoriaSlugPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // 🔥 Ahora pedimos SOLO los productos de esta categoría
        const data = await safeFetch(
          `${API_URL}/productos/?categoria=${slug}`,
          {},
          {
            file: "app/categorias/[slug]/page.tsx",
            functionName: "getProductosPorCategoria",
            route: `/categorias/${slug}`,
          }
        );

        const lista = Array.isArray(data) ? data : [];
        setProductos(lista);
      } catch (e) {
        console.error("❌ Error cargando productos por categoría:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-4">Cargando productos...</h1>
        <p className="text-gray-500 animate-pulse">Por favor espera</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-4">Error al cargar productos</h1>
        <p className="text-gray-600">Intenta nuevamente más tarde.</p>
      </main>
    );
  }

  // 🔥 Título seguro
  const titulo =
    typeof slug === "string" && slug.length > 0
      ? slug.replace(/-/g, " ")
      : "Categoría";

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-6 capitalize">{titulo}</h1>

      {productos.length === 0 && (
        <p className="text-gray-600 mb-10">No hay productos en esta categoría.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map((p: any) => (
          <ProductCardPremium key={p.id} {...p} />
        ))}
      </div>
    </main>
  );
}
