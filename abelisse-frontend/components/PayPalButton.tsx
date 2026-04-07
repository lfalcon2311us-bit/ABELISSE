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
    const container = document.getElementById("paypal-button-container");
    if (container) container.innerHTML = "";

    const oldScript = document.getElementById("paypal-sdk");
    if (oldScript) oldScript.remove();

    const script = document.createElement("script");
    script.id = "paypal-sdk";

    // ⭐ CLIENT ID DESDE ENV
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${currency}`;
    script.async = true;

    script.onload = () => {
      if (!window.paypal) return;

      window.paypal
        .Buttons({
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
            return data.order_id || data.id;
          },

          onApprove: async (data: any) => {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/paypal/capture-order/`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order_id: data.orderID }),
              }
            );

            if (res.ok) window.location.href = "/pago-exitoso";
            else window.location.href = "/pago-fallido";
          },

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
