"use client";

import { useEffect, useState } from "react";
import CategoryCardPremium from "@/components/CategoryCardPremium";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const backend = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();

        if (!backend) {
          console.error("❌ Falta NEXT_PUBLIC_BACKEND_URL");
          setError(true);
          setLoading(false);
          return;
        }

        const cleanBackend = backend.replace(/\/$/, "");

        const res = await fetch(`${cleanBackend}/api/categorias/`, {
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("❌ Error al cargar categorías:", res.status);
          setError(true);
          setLoading(false);
          return;
        }

        const data = await res.json();

        // 🔥 Filtrar categorías válidas
        const validas = Array.isArray(data)
          ? data.filter((c) => c && c.nombre && c.slug)
          : [];

        setCategorias(validas);
      } catch (error) {
        console.error("❌ Error cargando categorías:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchCategorias();
  }, []);

  // 🔥 Loading elegante
  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-4">Cargando categorías...</h1>
        <p className="text-gray-500 animate-pulse">Por favor espera</p>
      </main>
    );
  }

  // 🔥 Error visual
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
