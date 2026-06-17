"use client";
import { useEffect } from "react";

interface CarritoItem {
  id: number;
  cantidad: number;
}

export default function PagoExitosoPage() {
  useEffect(() => {
    try {
      // Carrito completo guardado en el navegador
      const carritoLocal: CarritoItem[] = JSON.parse(
        localStorage.getItem("carrito") || "[]"
      );

      // Productos que el cliente realmente pagó
      const carritoPagado: CarritoItem[] = JSON.parse(
        sessionStorage.getItem("carrito_pagado") || "[]"
      );

      console.log("🛒 Carrito local:", carritoLocal);
      console.log("💳 Carrito pagado:", carritoPagado);

      // Filtrar: dejar solo los productos NO pagados
      const carritoActualizado = carritoLocal.filter(
        (item: CarritoItem) =>
          !carritoPagado.some(
            (pagado: CarritoItem) => pagado.id === item.id
          )
      );

      // Guardar carrito actualizado
      localStorage.setItem("carrito", JSON.stringify(carritoActualizado));

      console.log("🧹 Carrito después del pago:", carritoActualizado);

      // Limpiar carrito_pagado temporal
      sessionStorage.removeItem("carrito_pagado");
    } catch (e) {
      console.log("⚠️ Error limpiando carrito:", e);
    }
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-center">
      <h1 className="text-3xl font-semibold text-green-600 mb-4">
        ¡Pago completado con éxito! 🎉
      </h1>

      <p className="text-gray-700 text-lg mb-8">
        Gracias por tu compra. Tu pedido está siendo procesado y recibirás un
        correo con los detalles muy pronto.
      </p>

      <a
        href="/productos"
        className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-medium"
      >
        Seguir comprando
      </a>
    </main>
  );
}
