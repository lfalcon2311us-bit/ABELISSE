"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Image from "next/image";

export default function ProductoPage({ params }: { params: { id: string } }) {
  const id = params.id;

  // 🛑 Protección contra IDs inválidos
  if (!id || id === "undefined" || id === "null") {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold">Producto no encontrado</h1>
      </main>
    );
  }

  const [producto, setProducto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ⭐ Fetch del producto
  useEffect(() => {
    async function fetchProducto() {
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

      if (!backend) {
        console.error("❌ Falta NEXT_PUBLIC_BACKEND_URL");
        setLoading(false);
        return;
      }

      // 🔥 FIX: SIN SLASH FINAL
      const url = `${backend.replace(/\/$/, "")}/api/productos/${id}`;

      try {
        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) {
          console.error("❌ Error cargando producto:", res.status, url);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setProducto(data);
      } catch (e) {
        console.error("❌ Error de conexión con el backend:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchProducto();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold">Cargando producto...</h1>
      </main>
    );
  }

  // Producto no encontrado
  if (!producto) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold">Producto no encontrado</h1>
      </main>
    );
  }

  // ⭐ Armamos el array de imágenes (solo válidas)
  const imagenes = [
    producto.imagen_principal,
    producto.imagen_secundaria,
    producto.imagen_terciaria,
  ].filter((img) => img && img.trim() !== "") as string[];

  // ⭐ Estado del carrusel
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // ⭐ Reset del índice si cambia la cantidad de imágenes
  useEffect(() => {
    setIndex(0);
  }, [imagenes.length]);

  // ⭐ Autoplay inteligente
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

        {/* 🔥 CARRUSEL GRANDE */}
        <div
          className="relative w-full rounded-xl overflow-hidden shadow-md bg-gray-100"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <Image
            src={imagenes[index] || "/placeholder.png"}
            alt={producto.nombre}
            width={800}
            height={800}
            unoptimized
            className="w-full h-full object-cover transition-all duration-500"
          />

          {/* Botón anterior */}
          {imagenes.length > 1 && (
            <button
              onClick={() =>
                setIndex((index - 1 + imagenes.length) % imagenes.length)
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white px-3 py-2 rounded-full shadow text-2xl"
            >
              ‹
            </button>
          )}

          {/* Botón siguiente */}
          {imagenes.length > 1 && (
            <button
              onClick={() => setIndex((index + 1) % imagenes.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white px-3 py-2 rounded-full shadow text-2xl"
            >
              ›
            </button>
          )}

          {/* Miniaturas */}
          {imagenes.length > 1 && (
            <div className="flex gap-3 mt-4 justify-center p-4">
              {imagenes.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border transition ${
                    index === i ? "border-pink-500 scale-105" : "border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Miniatura ${i}`}
                    width={80}
                    height={80}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 🔥 INFORMACIÓN DEL PRODUCTO */}
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
