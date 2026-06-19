import { reportErrorToBackend } from "./logger";

let reportedErrors = new Set();

function shouldReport(key: string) {
  if (reportedErrors.has(key)) return false;
  reportedErrors.add(key);
  return true;
}

function normalizeBackendUrl() {
  let raw = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  if (!raw) return null;

  raw = raw.trim().replace(/\/+$/, "");
  if (!raw.startsWith("http")) raw = `https://${raw}`;

  try {
    new URL(raw);
  } catch {
    return null;
  }

  return raw;
}

const safeBackend = normalizeBackendUrl();
export const API_URL = `${safeBackend}/api`;

export async function safeFetch(url: string, options: RequestInit = {}, context: any) {
  const key = `${context.file}-${context.functionName}-${url}`;

  try {
    const res = await fetch(url, { cache: "force-cache", ...options });

    if (!res.ok) {
      if (shouldReport(key)) {
        await reportErrorToBackend(`Respuesta no OK (${res.status})`, null, {
          ...context,
          requestUrl: url,
          requestMethod: options.method || "GET",
        });
      }
      return null;
    }

    return await res.json();
  } catch (error) {
    if (shouldReport(key)) {
      await reportErrorToBackend("Error de conexión con el backend", error, {
        ...context,
        requestUrl: url,
        requestMethod: options.method || "GET",
      });
    }
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
