import ProductCardPremium from "@/components/ProductCardPremium";
import Breadcrumbs from "@/components/Breadcrumbs";

async function getProductosPorCategoria(slug: string) {
  const res = await fetch(
    `http://127.0.0.1:8000/api/categorias/${slug}/productos/`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];

  return res.json();
}

export default async function CategoriaProductos({ params }: any) {
  const { slug } = params;
  const products = await getProductosPorCategoria(slug);

  const categoriaNombre = slug.replace(/-/g, " ");

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">

      {/* BREADCRUMBS */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categorías", href: "/categorias" },
          { label: categoriaNombre }
        ]}
      />

      <h1 className="text-3xl font-semibold mb-10 capitalize">
        Productos en {categoriaNombre}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((p: any) => (
          <ProductCardPremium
            key={p.id}
            id={p.id}
            nombre={p.nombre}
            precio_venta_soles={p.precio_venta_soles}
            precio_mercado={p.precio_mercado}
            descuento_porcentaje={p.descuento_porcentaje}
            imagen_principal={p.imagen_principal}
            precio_venta_usd={p.precio_venta_usd}
            descripcion={p.descripcion}
            calificacion_promedio={p.calificacion_promedio}
          />
        ))}
      </div>
    </main>
  );
}
