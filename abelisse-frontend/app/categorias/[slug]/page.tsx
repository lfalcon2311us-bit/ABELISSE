import ProductCardPremium from "@/components/ProductCardPremium";
import Breadcrumbs from "@/components/Breadcrumbs";

// 🔥 Fetch único al backend
async function getProductos() {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();

  if (!backend) {
    console.error("❌ Falta NEXT_PUBLIC_BACKEND_URL");
    return [];
  }

  try {
    const cleanBackend = backend.replace(/\/$/, "");

    const res = await fetch(`${cleanBackend}/api/productos/`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("❌ Error cargando productos:", res.status);
      return [];
    }

    return await res.json();
  } catch (e) {
    console.error("❌ Error conectando al backend:", e);
    return [];
  }
}

export async function generateMetadata({ params }: any) {
  const nombre = params.slug.replace(/-/g, " ");

  return {
    title: `${nombre} | ABELISSE`,
    description: `Explora productos de la categoría ${nombre} en ABELISSE.`,
  };
}

export default async function CategoriaProductos({ params }: any) {
  const { slug } = params;

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
        {products.map((p: any) => {
          const stock = p.stock ?? {};

          return (
            <ProductCardPremium
              key={p.id}
              id={p.id}
              nombre={p.nombre}
              precio_venta_soles={stock.precio_venta_soles}
              precio_mercado_soles={stock.precio_mercado_soles}
              descuento_porcentaje={stock.descuento_porcentaje}
              imagen_principal={stock.imagen_principal}
              imagen_secundaria={stock.imagen_secundaria}
              imagen_terciaria={stock.imagen_terciaria}
              precio_venta_usd={stock.precio_venta_usd}
              descripcion={p.descripcion}
              calificacion_promedio={p.calificacion_promedio}
            />
          );
        })}
      </div>
    </main>
  );
}
