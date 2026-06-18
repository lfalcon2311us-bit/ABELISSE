"use client";

import { useEffect, useState } from "react";
import ProductCardPremium from "@/components/ProductCardPremium";
import { getProductos } from "@/lib/server/api";

export default function CategoriaSlugPage({ params }: any) {
  const { slug } = params;

  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const all = await getProductos();
        const filtrados = all.filter(
          (p: any) => p?.categoria?.slug === slug
        );
        setProductos(filtrados);
      } catch (e) {
        console.error("❌ Error cargando productos:", e);
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
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-6 capitalize">{slug}</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map((p: any) => (
          <ProductCardPremium key={p.id} {...p} />
        ))}
      </div>
    </main>
  );
}
