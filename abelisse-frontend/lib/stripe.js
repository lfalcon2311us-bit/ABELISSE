import { loadStripe } from "@stripe/stripe-js";

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function iniciarPago({ total, carrito, email, nombre }) {
  if (!STRIPE_PUBLIC_KEY) {
    throw new Error("Falta NEXT_PUBLIC_STRIPE_PUBLIC_KEY en variables de entorno");
  }

  if (!BACKEND_URL) {
    throw new Error("Falta NEXT_PUBLIC_BACKEND_URL en variables de entorno");
  }

  // Ya no se usa redirectToCheckout, pero Stripe.js sigue siendo útil para otras funciones
  await loadStripe(STRIPE_PUBLIC_KEY);

  const response = await fetch(`${BACKEND_URL}/api/checkout/create-session/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      total,
      carrito,
      email,
      nombre,
    }),
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error("Error al crear sesión de pago");
  }

  const data = await response.json();

  if (!data.checkout_url) {
    console.error("Respuesta inesperada del backend:", data);
    throw new Error("No se recibió checkout_url de Stripe");
  }

  // 🔥 Nuevo método oficial: redirección manual
  window.location.href = data.checkout_url;
}
