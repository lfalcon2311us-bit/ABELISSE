import ProductCardPremium from "@/components/ProductCardPremium";
import Breadcrumbs from "@/components/Breadcrumbs";

// 🔥 Fetch único al backend
async function getProductos() {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!backend) {
    console.error("❌ Falta NEXT_PUBLIC_BACKEND_URL");
    return [];
  }

  const res = await fetch(`${backend}/api/productos/`, { cache: "no-store" });

  if (!res.ok) {
    console.error("❌ Error cargando productos");
    return [];
  }

  return res.json();
}

// 🔥 SEO dinámico PRO
export async function generateMetadata({ params }: any) {
  const nombre = params.slug.replace(/-/g, " ");

  return {
    title: `${nombre} | ABELISSE`,
    description: `Explora productos de la categoría ${nombre} en ABELISSE.`,

    openGraph: {
      title: `${nombre} | ABELISSE`,
      description: `Productos seleccionados de la categoría ${nombre}.`,
      url: `https://www.abelisse.com/categorias/${params.slug}`,
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: nombre,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${nombre} | ABELISSE`,
      description: `Explora productos de la categoría ${nombre}.`,
      images: ["/og-image.jpg"],
    },

    alternates: {
      canonical: `https://www.abelisse.com/categorias/${params.slug}`,
    },
  };
}

export default async function CategoriaProductos({ params }: any) {
  const { slug } = params;

  // 🔥 Un solo fetch
  const productos = await getProductos();

  // 🔥 Filtrar por categoría
  const products = productos.filter(
    (p: any) => p.categoria?.slug === slug
  );

  const categoriaNombre = slug.replace(/-/g, " ");

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categorías", href: "/categorias" },
          { label: categoriaNombre },
        ]}
      />

      <h1 className="text-3xl font-semibold mb-10 capitalize">
        Productos en {categoriaNombre}
      </h1>

      {products.length === 0 && (
        <p className="text-gray-600">No hay productos en esta categoría.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((p: any) => (
          <ProductCardPremium key={p.id} {...p} />
        ))}
      </div>
    </main>
  );
}
