"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Image from "next/image";

export default function ProductoPage({ params }: { params: { id: string } }) {
  const id = params.id;

  if (!id || id === "undefined" || id === "null") {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold">Producto no encontrado</h1>
      </main>
    );
  }

  const [producto, setProducto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducto() {
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backend) return;

      const url = `${backend.replace(/\/$/, "")}/api/productos/${id}`;

      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        setProducto(data);
      } catch (e) {
        console.error("❌ Error:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchProducto();
  }, [id]);

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold">Cargando producto...</h1>
      </main>
    );
  }

  if (!producto) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold">Producto no encontrado</h1>
      </main>
    );
  }

  const imagenes = [
    producto.imagen_principal,
    producto.imagen_secundaria,
    producto.imagen_terciaria,
  ].filter((img) => typeof img === "string" && img.trim().length > 10);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setIndex(0);
  }, [imagenes.length]);

  useEffect(() => {
    if (imagenes.length <= 1 || paused) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % imagenes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [imagenes.length, paused]);

  const categoriaSlug = producto.categoria?.slug || null;
  const categoriaNombre = categoriaSlug
    ? categoriaSlug.replace(/-/g, " ")
    : null;

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categorías", href: "/categorias" },
          categoriaSlug
            ? { label: categoriaNombre, href: `/categorias/${categoriaSlug}` }
            : null,
          { label: producto.nombre },
        ].filter(Boolean) as any}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* 🔥 CARRUSEL */}
        <div
          className="relative w-full rounded-xl overflow-hidden shadow-md bg-gray-100"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <Image
            key={imagenes[index] ?? "placeholder"}
            src={imagenes[index] ?? "/placeholder.png"}
            alt={producto.nombre}
            width={800}
            height={800}
            unoptimized
            className="w-full h-full object-cover transition-all duration-500"
          />

          {imagenes.length > 1 && (
            <>
              <button
                onClick={() =>
                  setIndex((index - 1 + imagenes.length) % imagenes.length)
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white px-3 py-2 rounded-full shadow text-2xl"
              >
                ‹
              </button>

              <button
                onClick={() => setIndex((index + 1) % imagenes.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white px-3 py-2 rounded-full shadow text-2xl"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* 🔥 INFO */}
        <div>
          <h1 className="text-3xl font-semibold mb-4">{producto.nombre}</h1>

          <div className="mb-6">
            <p className="text-2xl font-bold text-pink-600">
              S/ {producto.precio_venta_soles}
            </p>

            {producto.precio_mercado_soles > 0 && (
              <p className="text-gray-500 line-through">
                S/ {producto.precio_mercado_soles}
              </p>
            )}

            {producto.descuento_porcentaje > 0 && (
              <p className="text-green-600 font-semibold">
                -{producto.descuento_porcentaje}% de descuento
              </p>
            )}
          </div>

          <p className="text-gray-700 mb-8 leading-relaxed">
            {producto.descripcion || "Sin descripción disponible."}
          </p>

          <button className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition">
            Agregar al carrito
          </button>
        </div>
      </div>
    </main>
  );
}
