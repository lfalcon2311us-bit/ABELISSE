"use client";
import { useEffect } from "react";

export default function PagoExitosoPage() {
  useEffect(() => {
    // 🔥 Limpiar carrito local (localStorage)
    try {
      localStorage.removeItem("carrito");
      console.log("🛒 Carrito limpiado después del pago");
    } catch (e) {
      console.log("⚠️ No se pudo limpiar el carrito:", e);
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
