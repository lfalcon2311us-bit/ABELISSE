"use client";

import { useEffect, useState } from "react";
import CategoryCardPremium from "@/components/CategoryCardPremium";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

        if (!backend) {
          console.error("❌ Falta NEXT_PUBLIC_BACKEND_URL");
          return;
        }

        const res = await fetch(`${backend}/api/categorias/`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Error al cargar categorías");

        const data = await res.json();
        setCategorias(data);
      } catch (error) {
        console.error("❌ Error cargando categorías:", error);
      }
    }

    fetchCategorias();
  }, []);

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
