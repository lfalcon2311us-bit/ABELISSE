"use client";

export default function PagoFallidoPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-center">
      <h1 className="text-3xl font-semibold text-red-600 mb-4">
        Hubo un problema con tu pago ❌
      </h1>

      <p className="text-gray-700 text-lg mb-8">
        No se pudo completar la transacción. Por favor intenta nuevamente o usa
        otro método de pago.
      </p>

      <a
        href="/carrito"
        className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-medium"
      >
        Volver al carrito
      </a>
    </main>
  );
}
