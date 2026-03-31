"use client";

import { useEffect, useState } from "react";
import ProductCardPremium from "@/components/ProductCardPremium";

export default function OfertasPage() {
  const [ofertas, setOfertas] = useState([]);

  useEffect(() => {
    async function fetchOfertas() {
      const res = await fetch("http://127.0.0.1:8000/api/productos/");
      const data = await res.json();

      const filtrados = data
        .filter((p: any) => Number(p.descuento_porcentaje) > 0)
        .sort(
          (a: any, b: any) =>
            Number(b.descuento_porcentaje) - Number(a.descuento_porcentaje)
        );

      setOfertas(filtrados);
    }

    fetchOfertas();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-6 text-black">Ofertas</h1>

      <p className="text-black mb-10">
        Aprovecha descuentos exclusivos por tiempo limitado.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {ofertas.map((p: any) => (
          <ProductCardPremium
            key={p.id}
            id={p.id}
            nombre={p.nombre}
            precio_venta_soles={p.precio_venta_soles}
            precio_mercado={p.precio_mercado}
            descuento_porcentaje={p.descuento_porcentaje}
            imagen_principal={p.imagen_principal}
            precio_venta_usd={p.precio_venta_usd}
            descripcion={p.descripcion}
            calificacion_promedio={p.calificacion_promedio}
          />
        ))}
      </div>
    </main>
  );
}
