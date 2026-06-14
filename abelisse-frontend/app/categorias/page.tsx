"use client";

import { useEffect, useState } from "react";
import CategoryCardPremium from "@/components/CategoryCardPremium";
import { getCategorias } from "@/lib/api";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCategorias();
        const validas = data.filter((c: any) => c?.nombre && c?.slug);
        setCategorias(validas);
      } catch (e) {
        console.error("❌ Error cargando categorías:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-4">Cargando categorías...</h1>
        <p className="text-gray-500 animate-pulse">Por favor espera</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-4">Error al cargar categorías</h1>
        <p className="text-gray-600">Intenta nuevamente más tarde.</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-6">Categorías</h1>

      <p className="text-black mb-10">
        Encuentra productos según tu rutina de belleza.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {categorias.map((cat: any) => (
          <CategoryCardPremium
            key={cat.id}
            nombre={cat.nombre}
            slug={cat.slug}
          />
        ))}
      </div>
    </main>
  );
}
