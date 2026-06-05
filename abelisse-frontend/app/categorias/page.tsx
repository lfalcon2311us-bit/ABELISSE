"use client";

import { useEffect, useState } from "react";
import CategoryCardPremium from "@/components/CategoryCardPremium";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const backend = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();

        if (!backend) {
          console.error("❌ Falta NEXT_PUBLIC_BACKEND_URL");
          setLoading(false);
          return;
        }

        const res = await fetch(`${backend}/api/categorias/`, {
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("❌ Error al cargar categorías:", res.status);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setCategorias(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Error cargando categorías:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategorias();
  }, []);

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold">Cargando categorías...</h1>
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
