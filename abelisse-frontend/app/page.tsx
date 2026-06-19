"use client";

import { useState, useEffect } from "react";

export const dynamic = "force-dynamic";

import HeroPremium from "@/components/HeroPremium";
import ProductCardPremium from "@/components/ProductCardPremium";
import CategoryCardPremium from "@/components/CategoryCardPremium";
import { getProductos } from "@/lib/api";

// 🔥 Tipo EXACTO según tu backend
type Producto = {
  id: number;
  sku: string;
  marca: string | null;
  nombre: string;
  slug: string;
  descripcion: string | null;
  tamano: string | null;

  categoria: any;
  subcategoria: any;

  stock: number;

  costo_compra: number;
  taxes: number;
  precio_importacion: number;

  valor_total_unidad: number;
  valor_general: number;

  precio_venta_usd: number;
  precio_venta_soles: number;
  precio_mercado_soles: number | null;

  descuento_soles: number;
  descuento_porcentaje: number;

  ganancia_unidad: number;
  ganancia_total: number;

  imagen_principal: string | null;
  imagen_secundaria: string | null;
  imagen_terciaria: string | null;

  destacado: boolean;
  activo: boolean;

  ventas_totales: number;
  busquedas_totales: number;
  calificacion_promedio: number;
  total_calificaciones: number;

  fecha_creacion: string;
  fecha_actualizacion: string;

  [key: string]: any;
};

export default function Home() {
  const [lista, setLista] = useState<Producto[]>([]);

  useEffect(() => {
    getProductos().then((productos) => {
      if (Array.isArray(productos)) {
        setLista(productos);
      }
    });
  }, []);

  // 🔥 El frontend SOLO organiza, NO calcula nada
  const masVendidos = [...lista]
    .sort((a, b) => b.ventas_totales - a.ventas_totales)
    .slice(0, 6);

  const masBuscados = [...lista]
    .sort((a, b) => b.busquedas_totales - a.busquedas_totales)
    .slice(0, 6);

  const nuevos = [...lista]
    .sort(
      (a, b) =>
        new Date(b.fecha_creacion).getTime() -
        new Date(a.fecha_creacion).getTime()
    )
    .slice(0, 6);

  const mejorCalificados = [...lista]
    .sort((a, b) => b.calificacion_promedio - a.calificacion_promedio)
    .slice(0, 6);

  const categorias = [
    { nombre: "Maquillaje", slug: "maquillaje" },
    { nombre: "Cuidado Facial", slug: "cuidado-facial" },
    { nombre: "Cabello", slug: "cabello" },
    { nombre: "Cuidado Corporal", slug: "cuidado-corporal" },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <HeroPremium />

      {/* CATEGORÍAS */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Categorías principales
          </h2>

          <p className="text-center text-black mb-10">
            Encuentra lo que necesitas según tu rutina de belleza.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categorias.map((cat) => (
              <CategoryCardPremium
                key={cat.slug}
                nombre={cat.nombre}
                slug={cat.slug}
              />
            ))}
          </div>
        </div>
      </section>

      {/* MÁS VENDIDOS */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Más vendidos</h2>
            <a href="/productos" className="text-sm text-pink-600 hover:underline">
              Ver todos
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {masVendidos.map((p) => (
              <ProductCardPremium key={p.id} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* MÁS BUSCADOS */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Más buscados</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {masBuscados.map((p) => (
              <ProductCardPremium key={p.id} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* NUEVOS */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Nuevos</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {nuevos.map((p) => (
              <ProductCardPremium key={p.id} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* MEJOR CALIFICADOS */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Mejor calificados</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mejorCalificados.map((p) => (
              <ProductCardPremium key={p.id} {...p} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
