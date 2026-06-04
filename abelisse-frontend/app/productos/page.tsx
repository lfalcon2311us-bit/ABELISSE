"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ProductoPage({ params }: any) {
  const { id } = params;
  const [producto, setProducto] = useState<any>(null);

  useEffect(() => {
    async function fetchProducto() {
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
      if (!backend) return;

      try {
        const res = await fetch(`${backend}/api/productos/${id}/`);
        if (!res.ok) return;
        const data = await res.json();
        setProducto(data);
      } catch (e) {
        console.error("Error cargando producto", e);
      }
    }

    fetchProducto();
  }, [id]);

  if (!producto) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold">Producto no encontrado</h1>
      </main>
    );
  }

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
        <div>
          <img
            src={
              producto.imagen_principal && producto.imagen_principal !== ""
                ? producto.imagen_principal
                : "/placeholder.png"
            }
            alt={producto.nombre}
            className="w-full rounded-xl shadow-md"
          />
        </div>

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
