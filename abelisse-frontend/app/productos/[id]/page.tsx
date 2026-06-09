"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Image from "next/image";

export default function ProductoPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const [producto, setProducto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducto() {
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backend) {
        console.error("❌ Falta NEXT_PUBLIC_BACKEND_URL");
        setLoading(false);
        return;
      }

      const url = `${backend.replace(/\/$/, "")}/api/productos/${id}`;

      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
          console.error("❌ Error cargando producto:", res.status);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setProducto(data);
      } catch (e) {
        console.error("❌ Error de conexión:", e);
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

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-4">{producto.nombre}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
        </div>

        <div>
          <p className="text-2xl font-bold text-pink-600 mb-4">
            S/ {producto.precio_venta_soles}
          </p>

          <p className="text-gray-700 mb-8 leading-relaxed">
            {producto.descripcion || "Sin descripción disponible."}
          </p>
        </div>
      </div>
    </main>
  );
}
