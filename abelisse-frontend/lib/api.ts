import { reportErrorToBackend } from "./logger";

const BACKEND_URL = "https://abelisse.onrender.com/api";

export const API_URL = BACKEND_URL;

export async function safeFetch(
  url: string,
  options: RequestInit = {},
  context: any
) {
  try {
    const res = await fetch(url, { cache: "no-store", ...options });

    if (!res.ok) {
      await reportErrorToBackend(`Respuesta no OK (${res.status})`, null, {
        ...context,
        requestUrl: url,
        requestMethod: options.method || "GET",
      });
      return null;
    }

    return await res.json();
  } catch (error) {
    await reportErrorToBackend("Error de conexión con el backend", error, {
      ...context,
      requestUrl: url,
      requestMethod: options.method || "GET",
    });
    return null;
  }
}

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
