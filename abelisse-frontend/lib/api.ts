import { reportErrorToBackend } from "./logger";

// -----------------------------
// 🔧 Normalización del backend
// -----------------------------
const rawBackend = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();

if (!rawBackend) {
  console.error("❌ Falta NEXT_PUBLIC_BACKEND_URL");
}

const backend = rawBackend?.replace(/\/+$/, ""); // quita slashes finales

const safeBackend = backend?.startsWith("http")
  ? backend
  : `https://${backend}`;

export const API_URL = `${safeBackend}/api`;


// -----------------------------
// 🔥 safeFetch con reportes
// -----------------------------
export async function safeFetch(
  url: string,
  options: RequestInit = {},
  context: {
    file: string;
    functionName?: string;
    route?: string;
  }
) {
  let res;

  try {
    res = await fetch(url, { cache: "no-store", ...options });
  } catch (error) {
    // Error de red, Render caído, DNS, timeout, etc.
    await reportErrorToBackend(
      "Error de conexión con el backend",
      error,
      {
        ...context,
        requestUrl: url,
        requestMethod: options.method || "GET",
      }
    );

    console.error("❌ Error de conexión con el backend:", error);
    throw new Error("No se pudo conectar con el servidor");
  }

  // Si la respuesta NO es OK (400, 404, 500, etc.)
  if (!res.ok) {
    const text = await res.text();

    await reportErrorToBackend(
      `Respuesta no OK (${res.status}) al hacer fetch`,
      null,
      {
        ...context,
        requestUrl: url,
        requestMethod: options.method || "GET",
        extra: { status: res.status, body: text },
      }
    );

    console.error("❌ Error del backend:", text);
    throw new Error("Error al cargar datos del servidor");
  }

  // Intentar parsear JSON
  try {
    return await res.json();
  } catch (error) {
    await reportErrorToBackend(
      "Respuesta no es JSON válido",
      error,
      {
        ...context,
        requestUrl: url,
        requestMethod: options.method || "GET",
      }
    );

    console.error("❌ Respuesta no es JSON válido:", error);
    throw new Error("El servidor devolvió datos inválidos");
  }
}


// -----------------------------
// 🔥 Endpoints
// -----------------------------
export async function getProductos() {
  return safeFetch(`${API_URL}/productos/`, {}, {
    file: "lib/api.ts",
    functionName: "getProductos",
    route: "/productos",
  });
}

export async function getCategorias() {
  return safeFetch(`${API_URL}/categorias/`, {}, {
    file: "lib/api.ts",
    functionName: "getCategorias",
    route: "/categorias",
  });
}
