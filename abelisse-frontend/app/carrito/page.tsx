"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useCountryStore, useDetectCountry } from "@/store/countryStore";
import { iniciarPago } from "@/lib/stripe";
import PayPalButton from "@/components/PayPalButton";

export default function CarritoPage() {
  // Detectar país automáticamente
  useDetectCountry();

  const { country, currency, loading } = useCountryStore();
  const { cart, removeFromCart, clearCart } = useCartStore();

  const isPeru = currency === "PEN";
  const symbol = isPeru ? "S/" : "$";

  // Total dinámico según país
  const total = cart.reduce(
    (acc, item) =>
      acc +
      (isPeru ? item.precio_soles : item.precio_usd) * item.quantity,
    0
  );

  // Stripe recibe la moneda correcta
  const stripeItems = cart.map((item) => ({
    name: item.nombre,
    price: isPeru ? item.precio_soles : item.precio_usd,
    quantity: item.quantity,
  }));

  if (cart.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold mb-4">Tu carrito está vacío</h1>

        <p className="mb-6 !text-black">
          Explora nuestros productos y añade tus favoritos al carrito.
        </p>

        <Link
          href="/"
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

      {/* Mostrar país detectado */}
      {!loading && (
        <p className="text-sm text-gray-500 mb-4">
          Detectado: {isPeru ? "Perú (PEN)" : "Resto del mundo (USD)"}
        </p>
      )}

      <div className="space-y-4 mb-8">
        {cart.map((item) => {
          const price = isPeru ? item.precio_soles : item.precio_usd;

          return (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b border-gray-200 pb-4"
            >
              <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={item.imagen_principal || "/placeholder.png"}
                  alt={item.nombre}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h2 className="font-medium !text-black">{item.nombre}</h2>

                {/* Precio dinámico */}
                <p className="text-pink-600 font-semibold">
                  {symbol} {price.toFixed(2)}
                </p>
              </div>

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

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm !text-black">Total</p>

          {/* Total dinámico */}
          <p className="text-2xl font-semibold text-pink-600">
            {symbol} {total.toFixed(2)}
          </p>
        </div>

        <div className="flex flex-col gap-3 items-end">
          {isPeru ? (
            <>
              {/* 🔥 MÉTODO DE PAGO PARA PERÚ */}
              <button className="px-6 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition text-sm">
                Pagar con Yape
              </button>
            </>
          ) : (
            <>
              {/* 🔥 MÉTODOS DE PAGO INTERNACIONALES */}
              <button
                onClick={() => iniciarPago(stripeItems)}
                className="px-6 py-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition text-sm"
              >
                Pagar con Stripe
              </button>

              <div className="w-full">
                <PayPalButton total={total} currency="USD" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
