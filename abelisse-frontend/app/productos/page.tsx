"use client";

import { useEffect, useState } from "react";
import ProductCardPremium from "@/components/ProductCardPremium";
import { API_URL, safeFetch } from "@/lib/api";

export default function ProductosPage({ searchParams }: any) {
  const [lista, setLista] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [subcategorias, setSubcategorias] = useState<any[]>([]);
  const [marcas, setMarcas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros desde URL
  const categoria = searchParams?.categoria || "";
  const subcategoria = searchParams?.subcategoria || "";
  const marca = searchParams?.marca || "";
  const orden = searchParams?.orden || "desc";
  const q = searchParams?.q?.toLowerCase() || "";

  // ---------------------------------------------------------
  // CARGAR CATEGORÍAS Y SUBCATEGORÍAS
  // ---------------------------------------------------------
  useEffect(() => {
    async function fetchFiltros() {
      try {
        const cats = await safeFetch(`${API_URL}/categorias/`, {}, {});
        const subs = await safeFetch(`${API_URL}/subcategorias/`, {}, {});

        setCategorias(Array.isArray(cats) ? cats : []);
        setSubcategorias(Array.isArray(subs) ? subs : []);
      } catch (e) {
        console.error("❌ Error cargando categorías/subcategorías:", e);
      }
    }

    fetchFiltros();
  }, []);

  // ---------------------------------------------------------
  // CARGAR PRODUCTOS
  // ---------------------------------------------------------
  useEffect(() => {
    async function fetchProductos() {
      try {
        const query = new URLSearchParams();

        if (categoria) query.append("categoria", categoria);
        if (subcategoria) query.append("subcategoria", subcategoria);
        if (marca) query.append("marca", marca);

        const url = `${API_URL}/productos/?${query.toString()}`;

        const productos = await safeFetch(url, {}, {});

        let arr = Array.isArray(productos) ? productos : [];

        // Extraer marcas dinámicamente
        const marcasUnicas = [...new Set(arr.map((p: any) => p.marca).filter(Boolean))];
        setMarcas(marcasUnicas);

        // Filtro de búsqueda
        if (q) {
          arr = arr.filter((p: any) =>
            p.nombre?.toLowerCase().includes(q) ||
            p.marca?.toLowerCase().includes(q) ||
            p.descripcion?.toLowerCase().includes(q)
          );
        }

        // Ordenar por precio
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
  }, [categoria, subcategoria, marca, orden, q]);

  // ---------------------------------------------------------
  // LOADING
  // ---------------------------------------------------------
  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold">Cargando productos...</h1>
      </main>
    );
  }

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------
  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-10">Productos</h1>

      {q && (
        <p className="text-gray-600 mb-6">
          Resultados para: <strong>{q}</strong>
        </p>
      )}

      {/* FILTROS */}
      <div className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-4">

        {/* Categorías dinámicas */}
        <select
          className="border p-2 rounded"
          onChange={(e) =>
            window.location.href = `/productos?categoria=${e.target.value}&orden=${orden}`
          }
          defaultValue={categoria}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c: any) => (
            <option key={c.id} value={c.slug}>{c.nombre}</option>
          ))}
        </select>

        {/* Subcategorías dinámicas */}
        <select
          className="border p-2 rounded"
          onChange={(e) =>
            window.location.href = `/productos?categoria=${categoria}&subcategoria=${e.target.value}&orden=${orden}`
          }
          defaultValue={subcategoria}
        >
          <option value="">Todas las subcategorías</option>
          {subcategorias
            .filter((s: any) => !categoria || s.categoria?.slug === categoria)
            .map((s: any) => (
              <option key={s.id} value={s.slug}>{s.nombre}</option>
            ))}
        </select>

        {/* Marcas dinámicas */}
        <select
          className="border p-2 rounded"
          onChange={(e) =>
            window.location.href = `/productos?categoria=${categoria}&marca=${e.target.value}&orden=${orden}`
          }
          defaultValue={marca}
        >
          <option value="">Todas las marcas</option>
          {marcas.map((m: string) => (
            <option key={m} value={m.toLowerCase()}>{m}</option>
          ))}
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
