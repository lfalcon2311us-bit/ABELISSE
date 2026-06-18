"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useCountryStore, useDetectCountry } from "@/store/countryStore";
import PayPalButton from "@/components/PayPalButton";
import QuantitySelector from "@/components/QuantitySelector";
import Toast from "@/components/Toast";

export default function CarritoPage() {
  useDetectCountry();

  const { currency, loading } = useCountryStore();
  const {
    cart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCartStore();

  const [toast, setToast] = useState("");

  const isPeru = currency === "PEN";
  const symbol = isPeru ? "S/" : "$";

  // ⭐ TOTAL SEGURO
  const total = cart.reduce((acc, item) => {
    const raw = isPeru ? item.precio_soles : item.precio_usd;
    const price = parseFloat(String(raw).replace(",", "."));
    if (!Number.isFinite(price)) return acc;
    return acc + price * item.quantity;
  }, 0);

  // ⭐ GUARDAR CARRITO PAGADO ANTES DE IR AL CHECKOUT
  const handleStripeCheckout = () => {
    sessionStorage.setItem("carrito_pagado", JSON.stringify(cart));
    window.location.href = "/checkout";
  };

  const handlePayPalCheckout = () => {
    sessionStorage.setItem("carrito_pagado", JSON.stringify(cart));
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold mb-4">Tu carrito está vacío</h1>

        <p className="mb-6 !text-black">
          Explora nuestros productos y añade tus favoritos al carrito.
        </p>

        <Link
          href="/productos"
          className="inline-block px-6 py-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold mb-2">Tu carrito</h1>

      {!loading && (
        <p className="text-sm text-gray-500 mb-4">
          {isPeru ? "Precios en Soles (PEN)" : "Precios en Dólares (USD)"}
        </p>
      )}

      {/* LISTA DE PRODUCTOS */}
      <div className="space-y-4 mb-8">
        {cart.map((item) => {
          const raw = isPeru ? item.precio_soles : item.precio_usd;
          const price = parseFloat(String(raw).replace(",", "."));

          const stock = item.stock ?? 20; // ⭐ fallback seguro

          return (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b border-gray-200 pb-4"
            >
              {/* IMAGEN */}
              <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={item.imagen_principal || "/placeholder.png"}
                  alt={item.nombre}
                  fill
                  className="object-cover"
                />
              </div>

              {/* INFO */}
              <div className="flex-1">
                <h2 className="font-medium !text-black">{item.nombre}</h2>

                <p className="text-pink-600 font-semibold">
                  {symbol} {price.toFixed(2)}
                </p>

                <p className="text-sm text-gray-500">
                  Stock disponible: {stock}
                </p>

                {/* SELECTOR DE CANTIDAD */}
                <QuantitySelector
                  quantity={item.quantity}
                  max={stock}
                  onIncrease={() => {
                    if (item.quantity >= stock) {
                      setToast("No hay más unidades disponibles");
                      return;
                    }
                    increaseQuantity(item.id);
                  }}
                  onDecrease={() => decreaseQuantity(item.id)}
                />
              </div>

              {/* ELIMINAR */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-sm px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100 transition"
              >
                Eliminar
              </button>
            </div>
          );
        })}
      </div>

      {/* TOTAL */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm !text-black">Total</p>

          <p className="text-2xl font-semibold text-pink-600">
            {symbol} {total.toFixed(2)}
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-sm px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
        >
          Vaciar carrito
        </button>
      </div>

      {/* MÉTODOS DE PAGO */}
      <div className="flex flex-col gap-3 items-end">

        {isPeru && (
          <button
            onClick={() => alert("Yape estará disponible pronto")}
            className="px-6 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition text-sm"
          >
            Pagar con Yape
          </button>
        )}

        <button
          onClick={handleStripeCheckout}
          className="px-6 py-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition text-sm"
        >
          Pagar con Stripe
        </button>

        <div className="w-full" onClick={handlePayPalCheckout}>
          <PayPalButton total={total} currency="USD" />
        </div>
      </div>

      {toast && <Toast message={toast} />}
    </div>
  );
}
