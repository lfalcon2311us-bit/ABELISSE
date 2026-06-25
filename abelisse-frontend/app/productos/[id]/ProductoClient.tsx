"use client";

import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import Toast from "@/components/Toast";

interface ProductoClientProps {
  producto: any;
}

export default function ProductoClient({ producto }: ProductoClientProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const [cantidad, setCantidad] = useState(1);
  const [toast, setToast] = useState("");

  // Mostrar todas las imágenes válidas
  const imagenes = [
    producto.imagen_principal,
    producto.imagen_secundaria,
    producto.imagen_terciaria,
  ].filter((img) => img && img !== "0" && img !== "");

  const nombre = producto.nombre ?? "Producto sin nombre";
  const descripcion = producto.descripcion ?? "Sin descripción disponible.";
  const marca = producto.marca ?? "Sin marca";
  const tamano = producto.tamano ?? "No especificado";
  const precio = Number(producto.precio_venta_soles ?? 0);
  const stock = Number(producto.stock ?? 0);

  const categoria = producto.categoria?.nombre ?? "Sin categoría";
  const subcategoria = producto.subcategoria?.nombre ?? "Sin subcategoría";

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

      {/* Galería de imágenes */}
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

      {/* Información */}
      <div className="mt-8 space-y-4">
        <p className="text-gray-700">{descripcion}</p>

        <p><strong>Marca:</strong> {marca}</p>
        <p><strong>Tamaño:</strong> {tamano}</p>
        <p><strong>Precio:</strong> S/ {precio.toFixed(2)}</p>
        <p><strong>Stock disponible:</strong> {stock}</p>
        <p><strong>Categoría:</strong> {categoria}</p>
        <p><strong>Subcategoría:</strong> {subcategoria}</p>
      </div>

      {/* Selector de cantidad + botón */}
      <div className="mt-10 flex items-center gap-6">
        <div className="flex items-center gap-3 border rounded-full px-4 py-2">
          <button onClick={disminuir} className="text-xl font-bold px-2">
            -
          </button>
          <span className="text-lg font-semibold">{cantidad}</span>
          <button onClick={aumentar} className="text-xl font-bold px-2">
            +
          </button>
        </div>

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
