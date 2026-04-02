import { loadStripe } from "@stripe/stripe-js";

export async function iniciarPago({ total, carrito, email, nombre }) {
  const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/create-session/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        total,
        carrito,
        email,
        nombre,
      }),
    }
  );

  const data = await response.json();

  if (data.sessionId) {
    stripe?.redirectToCheckout({ sessionId: data.sessionId });
  } else {
    console.error("❌ Error al crear sesión de Stripe:", data);
  }
}
