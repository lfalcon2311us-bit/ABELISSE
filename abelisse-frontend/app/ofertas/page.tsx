"use client";

import { useEffect, useState } from "react";
import ProductCardPremium from "@/components/ProductCardPremium";
import { getProductos } from "@/lib/api";

export default function OfertasPage() {
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOfertas() {
      try {
        const productos = await getProductos();

        if (!Array.isArray(productos)) {
          setOfertas([]);
          return;
        }

        // 🔥 Filtrar productos con descuento válido
        const filtrados = productos
          .filter((p: any) => Number(p?.descuento_porcentaje ?? 0) > 0)
          .sort(
            (a: any, b: any) =>
              Number(b?.descuento_porcentaje ?? 0) -
              Number(a?.descuento_porcentaje ?? 0)
          );

        setOfertas(filtrados);
      } catch (error) {
        console.error("❌ Error cargando ofertas:", error);
        setOfertas([]);
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
        {ofertas.map((p: any) => (
          <ProductCardPremium key={p.id} {...p} />
        ))}
      </div>
    </main>
  );
}
