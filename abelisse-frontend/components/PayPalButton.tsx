"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

declare global {
  interface Window {
    paypal: any;
  }
}

export default function PayPalButton({
  total,
  currency = "USD",
  email,
  nombre,
}: {
  total: number;
  currency?: string;
  email?: string;
  nombre?: string;
}) {
  const cart = useCartStore((state) => state.cart);

  useEffect(() => {
    // Limpiar contenedor
    const container = document.getElementById("paypal-button-container");
    if (container) container.innerHTML = "";

    // Eliminar SDK previo
    const oldScript = document.getElementById("paypal-sdk");
    if (oldScript) oldScript.remove();

    // Crear nuevo SDK
    const script = document.createElement("script");
    script.id = "paypal-sdk";

    // ⭐ CLIENT ID SANDBOX (cámbialo por el tuyo real)
    script.src = `https://www.paypal.com/sdk/js?client-id=Abd0yZtKk0bHc8Yt8X8Jt3Yt9Jt8Yt7Jt6Yt5Yt4Yt3Yt2Yt1&currency=${currency}`;
    script.async = true;

    script.onload = () => {
      if (!window.paypal) return;

      window.paypal
        .Buttons({
          // ---------------------------------------------------------
          // 🔥 CREAR ORDEN
          // ---------------------------------------------------------
          createOrder: async () => {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/paypal/create-order/`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  total,
                  carrito: cart,
                  email,
                  nombre,
                }),
              }
            );

            const data = await res.json();

            // PayPal devuelve order.id
            return data.id;
          },

          // ---------------------------------------------------------
          // 🔥 CAPTURAR ORDEN
          // ---------------------------------------------------------
          onApprove: async (data: any) => {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/paypal/capture-order/`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderID: data.orderID,
                }),
              }
            );

            if (res.ok) {
              // Redirección profesional
              window.location.href = "/pago-exitoso";
            } else {
              window.location.href = "/pago-fallido";
            }
          },

          // ---------------------------------------------------------
          // 🔥 ERROR EN BOTÓN
          // ---------------------------------------------------------
          onError: () => {
            window.location.href = "/pago-fallido";
          },
        })
        .render("#paypal-button-container");
    };

    document.body.appendChild(script);
  }, [total, currency, cart, email, nombre]);

  return <div id="paypal-button-container" className="w-full min-h-[50px]"></div>;
}
