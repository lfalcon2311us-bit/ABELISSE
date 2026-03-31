import { loadStripe } from "@stripe/stripe-js";

export async function iniciarPago(items) {
  const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

  const response = await fetch("http://localhost:8000/api/checkout/create-session/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items }),
  });

  const data = await response.json();

  if (data.url) {
    window.location.href = data.url;
  } else {
    console.error("Error al crear sesión de pago:", data);
  }
}
