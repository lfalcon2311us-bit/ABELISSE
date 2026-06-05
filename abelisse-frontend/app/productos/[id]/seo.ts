// SERVER FILE — NO "use client"

import type { Metadata } from "next";

async function getProducto(id: string) {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (!backend) throw new Error("Falta NEXT_PUBLIC_BACKEND_URL");

  const res = await fetch(`${backend}/api/productos/${id}/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Error al obtener producto");
  }

  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const producto = await getProducto(params.id);

  return {
    title: producto.nombre,
    description: producto.descripcion,
    openGraph: {
      title: producto.nombre,
      description: producto.descripcion,
      images: [
        {
          url: producto.imagen,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
