"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    paypal: any;
  }
}

export default function PayPalButton({
  total,
  currency = "USD",
}: {
  total: number;
  currency?: string;
}) {
  useEffect(() => {
    // Limpiar contenedor
    const container = document.getElementById("paypal-button-container");
    if (container) container.innerHTML = "";

    // Eliminar script previo
    const oldScript = document.getElementById("paypal-sdk");
    if (oldScript) oldScript.remove();

    // Crear script nuevo
    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=Abd0yZtKk0bHc8Yt8X8Jt3Yt9Jt8Yt7Jt6Yt5Yt4Yt3Yt2Yt1&currency=${currency}`;
    script.async = true;

    script.onload = () => {
      if (!window.paypal) return;

      // 🔥 Asegurar que el contenedor existe
      if (!document.getElementById("paypal-button-container")) return;

      window.paypal
        .Buttons({
          createOrder: async () => {
            const res = await fetch(
              "http://localhost:8000/api/paypal/create-order/",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ total }),
              }
            );

            const data = await res.json();
            return data.payment_id;
          },

          onApprove: async (data: any) => {
            const res = await fetch(
              `http://localhost:8000/api/paypal/capture-order/?paymentId=${data.paymentID}&PayerID=${data.payerID}`
            );

            const result = await res.json();
            alert("Pago completado con éxito");
          },
        })
        .render("#paypal-button-container");
    };

    document.body.appendChild(script);
  }, [total, currency]);

  return <div id="paypal-button-container" className="w-full min-h-[50px]"></div>;
}
