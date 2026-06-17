"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { iniciarPago } from "@/lib/stripe";
import PayPalButton from "@/components/PayPalButton";

export default function CheckoutPage() {
  const { cart } = useCartStore();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  // ⭐ TOTAL SEGURO
  const total = cart.reduce((acc, item) => {
    const raw = item.precio_usd;
    const price = parseFloat(String(raw).replace(",", "."));
    if (!Number.isFinite(price)) return acc;
    return acc + price * item.quantity;
  }, 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !nombre) {
      alert("Por favor completa tus datos");
      return;
    }

    // ⭐ Guardar carrito pagado ANTES de ir a Stripe
    sessionStorage.setItem("carrito_pagado", JSON.stringify(cart));

    try {
      await iniciarPago({
        total,
        carrito: cart,
        email,
        nombre,
      });
    } catch (error) {
      alert("Hubo un error al iniciar el pago.");
      console.error(error);
    }
  };

  const handlePayPalClick = () => {
    sessionStorage.setItem("carrito_pagado", JSON.stringify(cart));
  };

  return (
    <div className="max-w-lg mx-auto py-16 px-4 space-y-10">
      <h1 className="text-2xl font-semibold">Datos del comprador</h1>

      {/* FORMULARIO */}
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

      {/* PAYPAL */}
      <div className="pt-6 border-t" onClick={handlePayPalClick}>
        <PayPalButton
          total={total}
          currency="USD"
          email={email}
          nombre={nombre}
        />
      </div>
    </div>
  );
}
