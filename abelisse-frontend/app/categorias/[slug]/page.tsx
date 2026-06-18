"use client";

import { useEffect, useState } from "react";
import ProductCardPremium from "@/components/ProductCardPremium";
import { getProductos } from "@/lib/api";

export default function CategoriaSlugPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const all = await getProductos();

        // Manejo seguro si el backend devuelve null
        const lista = Array.isArray(all) ? all : [];

        const filtrados = lista.filter(
          (p: any) => p?.categoria?.slug === slug
        );

        setProductos(filtrados);
      } catch (e) {
        console.error("❌ Error cargando productos:", e);
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

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-6 capitalize">{slug.replace("-", " ")}</h1>

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
