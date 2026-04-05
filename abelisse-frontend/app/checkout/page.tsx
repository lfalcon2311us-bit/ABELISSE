"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { iniciarPago } from "@/lib/stripe";

export default function CheckoutPage() {
  const { cart } = useCartStore();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  const total = cart.reduce(
    (acc, item) => acc + Number(item.precio_usd || 0) * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await iniciarPago({
      total,
      carrito: cart,
      email,
      nombre,
    });
  };

  return (
    <div className="max-w-lg mx-auto py-16 px-4">
      <h1 className="text-2xl font-semibold mb-6">Datos del comprador</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-2 rounded-full hover:bg-pink-700 transition"
        >
          Continuar con Stripe
        </button>
      </form>
    </div>
  );
}
