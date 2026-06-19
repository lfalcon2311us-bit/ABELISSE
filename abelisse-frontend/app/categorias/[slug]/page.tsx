import ProductCardPremium from "@/components/ProductCardPremium";
import { safeFetch, API_URL } from "@/lib/api";

export default async function CategoriaSlugPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // 🔥 Fetch directo desde el servidor (server component)
  const productos = await safeFetch(
    `${API_URL}/productos/?categoria=${slug}`,
    {},
    {
      file: "app/categorias/[slug]/page.tsx",
      functionName: "getProductosPorCategoria",
      route: `/categorias/${slug}`,
    }
  );

  const lista = Array.isArray(productos) ? productos : [];

  // 🔥 Título seguro
  const titulo =
    typeof slug === "string" && slug.length > 0
      ? slug.replace(/-/g, " ")
      : "Categoría";

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-6 capitalize">{titulo}</h1>

      {lista.length === 0 && (
        <p className="text-gray-600 mb-10">No hay productos en esta categoría.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {lista.map((p: any) => (
          <ProductCardPremium key={p.id} {...p} />
        ))}
      </div>
    </main>
  );
}
