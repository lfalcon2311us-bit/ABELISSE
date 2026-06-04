const backend = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();

if (!backend) {
  console.error("❌ Falta NEXT_PUBLIC_BACKEND_URL");
}

const API_URL = `${backend}/api`;

export async function getProductos() {
  const res = await fetch(`${API_URL}/productos/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al cargar productos");
  return res.json();
}

export async function getCategorias() {
  const res = await fetch(`${API_URL}/categorias/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al cargar categorías");
  return res.json();
}
