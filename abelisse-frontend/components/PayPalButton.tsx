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

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    // ⭐ URL FIJA DEL BACKEND
    const backend = "https://abelisse.onrender.com";

    if (!clientId) {
      console.error("❌ Falta configuración de PayPal");
      return;
    }

    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&components=buttons&enable-funding=paylater`;
    script.async = true;

    script.onload = () => {
      if (!window.paypal) {
        console.error("❌ PayPal SDK no cargó correctamente");
        return;
      }

      window.paypal
        .Buttons({
          fundingSource: undefined,

          createOrder: async () => {
            try {
              sessionStorage.setItem("carrito_pagado", JSON.stringify(cart));

              const res = await fetch(`${backend}/api/paypal/create-order/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  total,
                  carrito: cart,
                  email,
                  nombre,
                }),
              });

              const data = await res.json();

              return data.order_id || data.id || "";
            } catch (error) {
              console.error("❌ Error creando orden PayPal:", error);
              return "";
            }
          },

          onApprove: async (data: any) => {
            try {
              const res = await fetch(`${backend}/api/paypal/capture-order/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order_id: data.orderID }),
              });

              if (res.ok) {
                window.location.href = "/pago-exitoso";
              } else {
                window.location.href = "/pago-fallido";
              }
            } catch (error) {
              console.error("❌ Error capturando orden PayPal:", error);
              window.location.href = "/pago-fallido";
            }
          },

          onError: () => {
            console.error("❌ Error en PayPal");
            window.location.href = "/pago-fallido";
          },
        })
        .render("#paypal-button-container");
    };

    document.body.appendChild(script);
  }, [total, currency, cart, email, nombre]);

  return <div id="paypal-button-container" className="w-full min-h-[50px]"></div>;
}
