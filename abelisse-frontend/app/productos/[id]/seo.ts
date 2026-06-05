// SERVER FILE — NO "use client"

import { Metadata } from "next";

async function getProducto(id: string) {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (!backend) return null;

  try {
    const res = await fetch(`${backend}/api/productos/${id}/`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const producto = await getProducto(params.id);

  if (!producto) {
    return {
      title: "Producto no encontrado | ABELISSE",
      description: "Este producto no existe o fue retirado.",
      robots: "noindex, nofollow",
    };
  }

  const nombre = producto.nombre || "Producto";
  const descripcion =
    producto.descripcion?.slice(0, 150) ||
    "Producto de belleza y cosmética premium.";

  const imagen =
    producto.imagen_principal && producto.imagen_principal !== ""
      ? producto.imagen_principal
      : "/placeholder.png";

  const url = `https://www.abelisse.com/productos/${params.id}`;

  return {
    title: `${nombre} | ABELISSE`,
    description: descripcion,

    openGraph: {
      title: nombre,
      description: descripcion,
      type: "product",
      url,
      images: [{ url: imagen }],
    },

    twitter: {
      card: "summary_large_image",
      title: nombre,
      description: descripcion,
      images: [imagen],
    },

    alternates: {
      canonical: url,
    },
  };
}
