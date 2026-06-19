"use client";

import { useEffect, useState } from "react";
import ProductCardPremium from "@/components/ProductCardPremium";
import { API_URL, safeFetch } from "@/lib/api";

export default function ProductosPage({ searchParams }: any) {
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categoria = searchParams?.categoria || "";
  const subcategoria = searchParams?.subcategoria || "";
  const marca = searchParams?.marca || "";
  const orden = searchParams?.orden || "desc";

  useEffect(() => {
    async function fetchProductos() {
      try {
        const query = new URLSearchParams();

        if (categoria) query.append("categoria", categoria);
        if (subcategoria) query.append("subcategoria", subcategoria);
        if (marca) query.append("marca", marca);

        const url = `${API_URL}/productos/?${query.toString()}`;

        const productos = await safeFetch(url, {}, {
          file: "app/productos/page.tsx",
          functionName: "getProductosFiltrados",
          route: `/productos?${query.toString()}`,
        });

        let arr = Array.isArray(productos) ? productos : [];

        arr = arr.sort((a: any, b: any) => {
          const pa = Number(a.precio_venta_soles ?? 0);
          const pb = Number(b.precio_venta_soles ?? 0);
          return orden === "asc" ? pa - pb : pb - pa;
        });

        setLista(arr);
      } catch (e) {
        console.error("❌ Error cargando productos:", e);
        setLista([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProductos();
  }, [categoria, subcategoria, marca, orden]);

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold">Cargando productos...</h1>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-10">Productos</h1>

      {/* FILTROS */}
      <div className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-4">

        {/* Categorías */}
        <select
          className="border p-2 rounded"
          onChange={(e) =>
            window.location.href = `/productos?categoria=${e.target.value}&orden=${orden}`
          }
          defaultValue={categoria}
        >
          <option value="">Todas las categorías</option>
          <option value="maquillaje">Maquillaje</option>
          <option value="cabello">Cabello</option>
          <option value="cuidado-corporal">Cuidado Corporal</option>
          <option value="cuidado-facial">Cuidado Facial</option>
        </select>

        {/* Subcategorías */}
        <select
          className="border p-2 rounded"
          onChange={(e) =>
            window.location.href = `/productos?categoria=${categoria}&subcategoria=${e.target.value}&orden=${orden}`
          }
          defaultValue={subcategoria}
        >
          <option value="">Todas las subcategorías</option>
          <option value="mejillas">Mejillas</option>
          <option value="ojos">Ojos</option>
          <option value="labios">Labios</option>
        </select>

        {/* Marca */}
        <select
          className="border p-2 rounded"
          onChange={(e) =>
            window.location.href = `/productos?categoria=${categoria}&marca=${e.target.value}&orden=${orden}`
          }
          defaultValue={marca}
        >
          <option value="">Todas las marcas</option>
          <option value="one size">One Size</option>
          <option value="maybelline">Maybelline</option>
          <option value="fenty">Fenty Beauty</option>
        </select>

        {/* Precio */}
        <select
          className="border p-2 rounded"
          onChange={(e) =>
            window.location.href = `/productos?categoria=${categoria}&orden=${e.target.value}`
          }
          defaultValue={orden}
        >
          <option value="desc">Precio: Mayor a menor</option>
          <option value="asc">Precio: Menor a mayor</option>
        </select>
      </div>

      {/* LISTA */}
      {lista.length === 0 && (
        <p className="text-gray-600">No hay productos disponibles.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {lista.map((p: any) => (
          <ProductCardPremium key={p.id} {...p} />
        ))}
      </div>
    </main>
  );
}
