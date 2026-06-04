// 🔥 Forzar que esta página sea dinámica
export const dynamic = "force-dynamic";

import Breadcrumbs from "@/components/Breadcrumbs";

// 🔥 Fetch único al backend REAL
async function getProducto(id: string) {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();

  if (!backend) {
    console.error("❌ Falta NEXT_PUBLIC_BACKEND_URL");
    return null;
  }

  try {
    const res = await fetch(`${backend}/api/productos/${id}/`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("❌ Error cargando producto:", res.status);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("❌ Error de conexión con el backend:", error);
    return null;
  }
}

// 🔥 SEO dinámico PRO
export async function generateMetadata({ params }: any) {
  const producto = await getProducto(params.id);

  if (!producto) {
    return {
      title: "Producto no encontrado | ABELISSE",
      description: "Este producto no existe o fue retirado.",
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

  return {
    title: `${nombre} | ABELISSE`,
    description: descripcion,

    openGraph: {
      title: nombre,
      description: descripcion,
      type: "product",
      url: `https://www.abelisse.com/productos/${params.id}`,
      images: [
        {
          url: imagen,
          width: 1200,
          height: 630,
          alt: nombre,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: nombre,
      description: descripcion,
      images: [imagen],
    },

    alternates: {
      canonical: `https://www.abelisse.com/productos/${params.id}`,
    },
  };
}

export default async function ProductoPage({ params }: any) {
  const { id } = params;
  const producto = await getProducto(id);

  if (!producto) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold">Producto no encontrado</h1>
      </main>
    );
  }

  const categoriaSlug = producto.categoria?.slug || null;
  const categoriaNombre = categoriaSlug
    ? categoriaSlug.replace(/-/g, " ")
    : null;

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categorías", href: "/categorias" },
          categoriaSlug
            ? { label: categoriaNombre, href: `/categorias/${categoriaSlug}` }
            : null,
          { label: producto.nombre },
        ].filter(Boolean) as any}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <img
            src={
              producto.imagen_principal && producto.imagen_principal !== ""
                ? producto.imagen_principal
                : "/placeholder.png"
            }
            alt={producto.nombre}
            className="w-full rounded-xl shadow-md"
          />
        </div>

        <div>
          <h1 className="text-3xl font-semibold mb-4">{producto.nombre}</h1>

          <div className="mb-6">
            <p className="text-2xl font-bold text-pink-600">
              S/ {producto.precio_venta_soles}
            </p>

            {producto.precio_mercado_soles > 0 && (
              <p className="text-gray-500 line-through">
                S/ {producto.precio_mercado_soles}
              </p>
            )}

            {producto.descuento_porcentaje > 0 && (
              <p className="text-green-600 font-semibold">
                -{producto.descuento_porcentaje}% de descuento
              </p>
            )}
          </div>

          <p className="text-gray-700 mb-8 leading-relaxed">
            {producto.descripcion || "Sin descripción disponible."}
          </p>

          <button className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition">
            Agregar al carrito
          </button>
        </div>
      </div>
    </main>
  );
}
