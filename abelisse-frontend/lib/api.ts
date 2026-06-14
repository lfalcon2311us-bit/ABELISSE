import { reportErrorToBackend } from "./logger";

// -----------------------------
// 🔧 Normalización del backend
// -----------------------------
function normalizeBackendUrl() {
  let raw = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  raw = raw.trim();

  if (!raw) {
    console.error("❌ NEXT_PUBLIC_BACKEND_URL está vacío");
    return null;
  }

  // Quitar slashes finales
  raw = raw.replace(/\/+$/, "");

  // Asegurar protocolo
  if (!raw.startsWith("http://") && !raw.startsWith("https://")) {
    raw = `https://${raw}`;
  }

  return raw;
}

const safeBackend = normalizeBackendUrl();
export const API_URL = safeBackend ? `${safeBackend}/api` : "";

// -----------------------------
// 🔥 safeFetch con fallback
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
  if (!safeBackend) {
    console.error("❌ Backend no configurado");
    return null;
  }

  let res;

  try {
    res = await fetch(url, { cache: "no-store", ...options });
  } catch (error) {
    await reportErrorToBackend("Error de conexión con el backend", error, {
      ...context,
      requestUrl: url,
      requestMethod: options.method || "GET",
    });

    console.error("❌ Error de conexión con el backend:", error);

    // Fallback directo
    try {
      const fallback = await fetch(url, { cache: "no-store" });
      if (!fallback.ok) return null;
      return await fallback.json();
    } catch (e) {
      console.error("❌ Fallback fetch también falló:", e);
      return null;
    }
  }

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
    return null;
  }

  try {
    return await res.json();
  } catch (error) {
    await reportErrorToBackend("Respuesta no es JSON válido", error, {
      ...context,
      requestUrl: url,
      requestMethod: options.method || "GET",
    });

    console.error("❌ Respuesta no es JSON válido:", error);
    return null;
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

export async function getProducto(id: string | number) {
  return safeFetch(`${API_URL}/productos/${id}/`, {}, {
    file: "lib/api.ts",
    functionName: "getProducto",
    route: `/productos/${id}`,
  });
}
