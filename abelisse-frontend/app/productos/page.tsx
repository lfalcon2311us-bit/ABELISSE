"use client";

import { useState, useEffect } from "react";
import ProductCardPremium from "@/components/ProductCardPremium";
import { useDetectCountry, useCountryStore } from "@/store/countryStore";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ProductosPage() {
  useDetectCountry();
  const { currency } = useCountryStore(); // "PEN" o "USD"

  const [productos, setProductos] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // Filtros
  const [search, setSearch] = useState("");
  const [marca, setMarca] = useState("");
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(""); // string para permitir vacío
  const [precioMaxDefault, setPrecioMaxDefault] = useState(0);
  const [soloDescuento, setSoloDescuento] = useState(false);
  const [orden, setOrden] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductos() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/productos/");
        const data = await res.json();

        setProductos(data);
        setFiltered(data);

        // Calcular precio máximo según moneda
        const precios = data.map((p: any) =>
          currency === "PEN" ? p.precio_venta_soles : p.precio_venta_usd
        );

        const max = Math.max(...precios);

        setPrecioMin(0);
        setPrecioMax(String(max));
        setPrecioMaxDefault(max);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProductos();
  }, [currency]);

  // Aplicar filtros
  useEffect(() => {
    let result = [...productos];

    // Búsqueda
    if (search.trim() !== "") {
      result = result.filter((p: any) =>
        p.nombre.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Marca
    if (marca) {
      result = result.filter(
        (p: any) => p.marca?.toLowerCase() === marca.toLowerCase()
      );
    }

    // Determinar precio máximo efectivo
    const maxToUse =
      precioMax === "" ? precioMaxDefault : Number(precioMax || precioMaxDefault);

    // Precio según moneda
    result = result.filter((p: any) => {
      const precio =
        currency === "PEN" ? p.precio_venta_soles : p.precio_venta_usd;

      return precio >= Number(precioMin) && precio <= maxToUse;
    });

    // Solo descuento
    if (soloDescuento) {
      result = result.filter((p: any) => p.descuento_porcentaje > 0);
    }

    // Ordenamiento
    if (orden === "precio-asc") {
      result.sort((a: any, b: any) => {
        const pa = currency === "PEN" ? a.precio_venta_soles : a.precio_venta_usd;
        const pb = currency === "PEN" ? b.precio_venta_soles : b.precio_venta_usd;
        return pa - pb;
      });
    }

    if (orden === "precio-desc") {
      result.sort((a: any, b: any) => {
        const pa = currency === "PEN" ? a.precio_venta_soles : a.precio_venta_usd;
        const pb = currency === "PEN" ? b.precio_venta_soles : b.precio_venta_usd;
        return pb - pa;
      });
    }

    if (orden === "ventas") {
      result.sort((a: any, b: any) => b.ventas_totales - a.ventas_totales);
    }

    if (orden === "rating") {
      result.sort(
        (a: any, b: any) => b.calificacion_promedio - a.calificacion_promedio
      );
    }

    setFiltered(result);
  }, [
    search,
    marca,
    precioMin,
    precioMax,
    precioMaxDefault,
    soloDescuento,
    orden,
    productos,
    currency,
  ]);

  // Obtener marcas únicas
  const marcasUnicas = [...new Set(productos.map((p: any) => p.marca))].filter(
    Boolean
  );

  const corregirPrecioMax = () => {
    if (precioMax === "" || Number(precioMax) === 0) {
      setPrecioMax(String(precioMaxDefault));
    }
  };

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-16">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Productos" }]}
        />
        <h1 className="text-3xl font-semibold mb-6">Productos</h1>
        <p>Cargando productos...</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      {/* BREADCRUMBS */}
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Productos" }]}
      />

      <h1 className="text-3xl font-semibold mb-10">Productos</h1>

      {/* FILTROS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {/* Marca */}
        <div>
          <label className="block mb-2 font-medium">Marca</label>
          <select
            aria-label="Filtrar por marca"
            className="w-full border rounded px-3 py-2"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
          >
            <option value="">Todas</option>
            {marcasUnicas.map((m: string) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Precio mínimo */}
        <div>
          <label className="block mb-2 font-medium">Precio mínimo</label>
          <input
            type="number"
            aria-label="Precio mínimo"
            placeholder="0"
            className="w-full border rounded px-3 py-2"
            value={precioMin}
            onChange={(e) => setPrecioMin(Number(e.target.value || 0))}
          />
        </div>

        {/* Precio máximo */}
        <div>
          <label className="block mb-2 font-medium">Precio máximo</label>
          <input
            type="number"
            aria-label="Precio máximo"
            placeholder={String(precioMaxDefault)}
            className="w-full border rounded px-3 py-2"
            value={precioMax}
            onChange={(e) => {
              // Permitir borrar completamente
              setPrecioMax(e.target.value);
            }}
            onBlur={corregirPrecioMax}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                corregirPrecioMax();
              }
            }}
          />
        </div>

        {/* Orden */}
        <div>
          <label className="block mb-2 font-medium">Ordenar por</label>
          <select
            aria-label="Ordenar productos"
            className="w-full border rounded px-3 py-2"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            <option value="">Ninguno</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="ventas">Más vendidos</option>
            <option value="rating">Mejor calificados</option>
          </select>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="mb-10">
        <input
          type="text"
          aria-label="Buscar producto"
          placeholder="Buscar producto..."
          className="w-full border rounded px-4 py-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Solo descuento */}
      <div className="mb-10">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            aria-label="Solo productos con descuento"
            checked={soloDescuento}
            onChange={(e) => setSoloDescuento(e.target.checked)}
          />
          <span>Solo productos con descuento</span>
        </label>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filtered.map((p: any) => (
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
