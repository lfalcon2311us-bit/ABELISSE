"use client";

import Image from "next/image";
import { useState } from "react";
import { safeFetch, API_URL } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import Toast from "@/components/Toast";

// 🔥 Normaliza y limpia el ID
function limpiarId(raw: string): string | null {
  if (!raw) return null;

  const limpio = raw.split("?")[0].split("&")[0].trim();

  return /^\d+$/.test(limpio) ? limpio : null;
}

async function getProductoSeguro(id: string) {
  const url = `${API_URL}/productos/${id}/`;

  try {
    return await safeFetch(
      url,
      { method: "GET" },
      {
        file: "app/productos/[id]/page.tsx",
        functionName: "getProducto",
        route: `/productos/${id}`,
      }
    );
  } catch (error) {
    console.error("❌ safeFetch falló:", error);

    try {
      const res = await fetch(url, { cache: "force-cache" });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error("❌ Fallback fetch también falló:", e);
      return null;
    }
  }
}

interface ProductoPageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function ProductoPage({ params }: ProductoPageProps) {
  const resolvedParams =
    params instanceof Promise ? await params : params;

  const id = limpiarId(resolvedParams.id);

  if (!id) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-center">Producto no válido</h1>
        <p className="text-center mt-4 text-gray-500">
          El ID del producto no es válido.
        </p>
      </main>
    );
  }

  const producto = await getProductoSeguro(id);

  if (!producto) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-center">Producto no encontrado</h1>
        <p className="text-center mt-4 text-gray-500">
          No pudimos cargar la información del producto.
        </p>
      </main>
    );
  }

  return <ProductoClient producto={producto} />;
}

function ProductoClient({ producto }: any) {
  const addToCart = useCartStore((state) => state.addToCart);

  const [cantidad, setCantidad] = useState(1);
  const [toast, setToast] = useState("");

  // 🔥 Imágenes seguras
  const imagenes = [
    producto.imagen_principal,
    producto.imagen_secundaria,
    producto.imagen_terciaria,
  ].filter(
    (img) =>
      typeof img === "string" &&
      img.startsWith("data:image") &&
      img.length < 500000
  );

  const nombre = producto.nombre ?? "Producto sin nombre";
  const descripcion = producto.descripcion ?? "Sin descripción disponible.";
  const marca = producto.marca ?? "Sin marca";
  const tamano = producto.tamano ?? "No especificado";
  const precio = Number(producto.precio_venta_soles ?? 0);
  const stock = Number(producto.stock ?? 0);

  const categoria = producto.categoria?.nombre ?? "Sin categoría";
  const subcategoria = producto.subcategoria?.nombre ?? "Sin subcategoría";

  // ⭐ Control de cantidad
  const aumentar = () => {
    if (cantidad < stock) setCantidad(cantidad + 1);
  };

  const disminuir = () => {
    if (cantidad > 1) setCantidad(cantidad - 1);
  };

  const agregarCarrito = () => {
    addToCart({
      id: producto.id,
      nombre,
      precio_venta_soles: precio,
      precio_venta_usd: producto.precio_venta_usd ?? 0,
      imagen_principal: producto.imagen_principal,
      stock,
      quantity: cantidad,
    });

    setToast("Producto agregado al carrito");
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">{nombre}</h1>

      {/* 🔥 Galería */}
      <div className="space-y-4">
        {imagenes.length > 0 ? (
          imagenes.map((img, i) => (
            <Image
              key={i}
              src={img}
              alt={nombre}
              width={800}
              height={800}
              unoptimized
              className="w-full rounded-xl object-cover"
            />
          ))
        ) : (
          <Image
            src="/placeholder.png"
            alt="Sin imagen"
            width={800}
            height={800}
            className="w-full rounded-xl object-cover"
          />
        )}
      </div>

      {/* 🔥 Información */}
      <div className="mt-8 space-y-4">
        <p className="text-gray-700">{descripcion}</p>

        <p><strong>Marca:</strong> {marca}</p>
        <p><strong>Tamaño:</strong> {tamano}</p>
        <p><strong>Precio:</strong> S/ {precio.toFixed(2)}</p>
        <p><strong>Stock disponible:</strong> {stock}</p>
        <p><strong>Categoría:</strong> {categoria}</p>
        <p><strong>Subcategoría:</strong> {subcategoria}</p>
      </div>

      {/* ⭐ Selector de cantidad + botón */}
      <div className="mt-10 flex items-center gap-6">
        {/* Cantidad */}
        <div className="flex items-center gap-3 border rounded-full px-4 py-2">
          <button
            onClick={disminuir}
            className="text-xl font-bold px-2"
          >
            -
          </button>

          <span className="text-lg font-semibold">{cantidad}</span>

          <button
            onClick={aumentar}
            className="text-xl font-bold px-2"
          >
            +
          </button>
        </div>

        {/* Botón agregar */}
        <button
          onClick={agregarCarrito}
          className="bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition"
        >
          Añadir al carrito
        </button>
      </div>

      {toast && <Toast message={toast} />}
    </main>
  );
}
