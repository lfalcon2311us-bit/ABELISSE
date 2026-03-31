"use client";

import { useEffect, useState } from "react";
import CategoryCardPremium from "@/components/CategoryCardPremium";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    async function fetchCategorias() {
      const res = await fetch("http://127.0.0.1:8000/api/categorias/");
      const data = await res.json();
      setCategorias(data);
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
