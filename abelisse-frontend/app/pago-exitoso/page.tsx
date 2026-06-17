"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

interface CarritoItem {
  id: number;
  cantidad?: number;
}

export default function PagoExitosoPage() {
  useEffect(() => {
    try {
      // Productos que el cliente realmente pagó (guardados antes del checkout)
      const carritoPagado: CarritoItem[] = JSON.parse(
        sessionStorage.getItem("carrito_pagado") || "[]"
      );

      console.log("💳 Productos pagados:", carritoPagado);

      if (carritoPagado.length > 0) {
        // ⭐ ELIMINAR SOLO LOS PRODUCTOS PAGADOS DEL STORE (Zustand)
        useCartStore.getState().removePaidItems(carritoPagado);

        console.log("🧹 Carrito actualizado en Zustand");
      }

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
