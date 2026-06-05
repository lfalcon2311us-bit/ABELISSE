const rawBackend = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();

// Validación básica
if (!rawBackend) {
  console.error("❌ Falta NEXT_PUBLIC_BACKEND_URL");
}

// Normalizar URL (evitar doble slash o falta de protocolo)
const backend = rawBackend?.replace(/\/+$/, ""); // quita slashes finales

// Si no tiene http/https, agregar https
const safeBackend = backend?.startsWith("http")
  ? backend
  : `https://${backend}`;

const API_URL = `${safeBackend}/api`;

// -----------------------------
// 🔥 Fetch seguro y reutilizable
// -----------------------------
async function safeFetch(url: string) {
  let res;

  try {
    res = await fetch(url, { cache: "no-store" });
  } catch (err) {
    console.error("❌ Error de conexión con el backend:", err);
    throw new Error("No se pudo conectar con el servidor");
  }

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Error del backend:", text);
    throw new Error("Error al cargar datos del servidor");
  }

  try {
    return await res.json();
  } catch (err) {
    console.error("❌ Respuesta no es JSON válido:", err);
    throw new Error("El servidor devolvió datos inválidos");
  }
}

// -----------------------------
// 🔥 Endpoints
// -----------------------------
export async function getProductos() {
  return safeFetch(`${API_URL}/productos/`);
}

export async function getCategorias() {
  return safeFetch(`${API_URL}/categorias/`);
}
