"use client";

import { useEffect, useState } from "react";
import ProductCardPremium from "@/components/ProductCardPremium";

export default function OfertasPage() {
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOfertas() {
      try {
        const backend = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();

        if (!backend) {
          console.error("❌ Falta NEXT_PUBLIC_BACKEND_URL");
          setLoading(false);
          return;
        }

        const cleanBackend = backend.replace(/\/$/, "");

        const res = await fetch(`${cleanBackend}/api/productos/`, {
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("❌ Error al cargar productos:", res.status);
          setLoading(false);
          return;
        }

        const data = await res.json();

        // 🔥 Filtrar productos con descuento Y con ID válido
        const filtrados = Array.isArray(data)
          ? data
              .filter((p: any) => {
                const id = Number(p.id ?? p.pk);
                return (
                  id &&
                  !isNaN(id) &&
                  id > 0 &&
                  Number(p.descuento_porcentaje) > 0
                );
              })
              .sort(
                (a: any, b: any) =>
                  Number(b.descuento_porcentaje) -
                  Number(a.descuento_porcentaje)
              )
          : [];

        setOfertas(filtrados);
      } catch (error) {
        console.error("❌ Error cargando ofertas:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOfertas();
  }, []);

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold">Cargando ofertas...</h1>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-6 text-black">Ofertas</h1>

      <p className="text-black mb-10">
        Aprovecha descuentos exclusivos por tiempo limitado.
      </p>

      {ofertas.length === 0 && (
        <p className="text-gray-600">No hay productos en oferta.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {ofertas.map((p: any) => {
          const id = Number(p.id ?? p.pk);

          // 🔥 Seguridad total: si el ID no es válido, no renderiza
          if (!id || isNaN(id) || id <= 0) return null;

          return (
            <ProductCardPremium
              key={id}
              id={id}
              nombre={p.nombre}
              precio_venta_soles={p.precio_venta_soles}
              precio_mercado_soles={p.precio_mercado_soles}
              descuento_porcentaje={p.descuento_porcentaje}
              imagen_principal={p.imagen_principal}
              imagen_secundaria={p.imagen_secundaria}
              imagen_terciaria={p.imagen_terciaria}
              precio_venta_usd={p.precio_venta_usd}
              descripcion={p.descripcion}
              calificacion_promedio={p.calificacion_promedio}
            />
          );
        })}
      </div>
    </main>
  );
}
