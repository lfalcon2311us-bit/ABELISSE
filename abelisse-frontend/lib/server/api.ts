import { reportErrorToBackend } from "../logger";

// --------------------------------------------------
// 🔧 Normalización robusta del backend
// --------------------------------------------------
function normalizeBackendUrl() {
  let raw = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  if (!raw || typeof raw !== "string") {
    console.error("❌ NEXT_PUBLIC_BACKEND_URL está vacío o mal definido");
    return null;
  }

  raw = raw.trim();

  raw = raw.split("?")[0].split("&")[0];
  raw = raw.replace(/\/+$/, "");

  if (!raw.startsWith("http://") && !raw.startsWith("https://")) {
    raw = `https://${raw}`;
  }

  try {
    new URL(raw);
  } catch {
    console.error("❌ NEXT_PUBLIC_BACKEND_URL no es una URL válida:", raw);
    return null;
  }

  return raw;
}

const safeBackend = normalizeBackendUrl();

export const API_URL = `${safeBackend}/api`;

// --------------------------------------------------
// 🔥 safeFetch (NO ES SERVER ACTION)
// --------------------------------------------------
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
    await reportErrorToBackend("Error de conexión con el backend", error, {
      ...context,
      requestUrl: url,
      requestMethod: options.method || "GET",
    });

    console.error("❌ Error de conexión con el backend:", error);

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

// --------------------------------------------------
// 🔥 Endpoints
// --------------------------------------------------
export async function getProductos() {
  return safeFetch(`${API_URL}/productos/`, {}, {
    file: "lib/server/api.ts",
    functionName: "getProductos",
    route: "/productos",
  });
}

export async function getCategorias() {
  return safeFetch(`${API_URL}/categorias/`, {}, {
    file: "lib/server/api.ts",
    functionName: "getCategorias",
    route: "/categorias",
  });
}

export async function getProducto(id: string | number) {
  return safeFetch(`${API_URL}/productos/${id}/`, {}, {
    file: "lib/server/api.ts",
    functionName: "getProducto",
    route: `/productos/${id}`,
  });
}
