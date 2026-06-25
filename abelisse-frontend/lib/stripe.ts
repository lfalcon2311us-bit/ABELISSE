import { loadStripe } from "@stripe/stripe-js";

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

// ⭐ URL FIJA DEL BACKEND (Squarespace NO soporta variables de entorno)
const BACKEND_URL = "https://abelisse.onrender.com";

export async function iniciarPago({
  total,
  carrito,
  email,
  nombre,
}: {
  total: number;
  carrito: any[];
  email: string;
  nombre: string;
}) {
  if (!STRIPE_PUBLIC_KEY) {
    throw new Error("Falta NEXT_PUBLIC_STRIPE_PUBLIC_KEY");
  }

  if (!Number.isFinite(total) || total <= 0) {
    throw new Error("El total del pago no es válido");
  }

  // ⭐ Guardar carrito pagado ANTES de ir a Stripe
  sessionStorage.setItem("carrito_pagado", JSON.stringify(carrito));

  // ⭐ Cargar Stripe.js
  await loadStripe(STRIPE_PUBLIC_KEY);

  let response;
  try {
    response = await fetch(`${BACKEND_URL}/api/checkout/create-session/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        total,
        carrito,
        email,
        nombre,
      }),
    });
  } catch (err) {
    console.error("❌ Error de conexión con el backend:", err);
    throw new Error("No se pudo conectar con el servidor de pagos");
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Error del backend:", errorText);
    throw new Error("Error al crear sesión de pago");
  }

  const data = await response.json();

  if (!data.checkout_url) {
    console.error("❌ Respuesta inesperada del backend:", data);
    throw new Error("No se recibió checkout_url de Stripe");
  }

  const checkoutUrl = data.checkout_url.startsWith("http")
    ? data.checkout_url
    : `https://${data.checkout_url}`;

  window.location.href = checkoutUrl;
}
