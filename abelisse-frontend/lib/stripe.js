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

  // Validación de total
  if (!Number.isFinite(total) || total <= 0) {
    throw new Error("El total del pago no es válido");
  }

  // Cargar Stripe.js (aunque no uses redirectToCheckout, Stripe recomienda cargarlo)
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

  // Asegurar que la URL sea HTTPS
  const checkoutUrl = data.checkout_url.startsWith("http")
    ? data.checkout_url
    : `https://${data.checkout_url}`;

  // Redirección manual
  window.location.href = checkoutUrl;
}
