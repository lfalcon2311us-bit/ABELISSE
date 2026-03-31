import ProductCardPremium from "@/components/ProductCardPremium";
import Breadcrumbs from "@/components/Breadcrumbs";

async function getProducto(id: string) {
  const res = await fetch(`http://127.0.0.1:8000/api/productos/${id}/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Error al cargar producto");
    return null;
  }

  return res.json();
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

  // Nombre bonito de la categoría (si existe)
  const categoriaSlug = producto.categoria?.slug || null;
  const categoriaNombre = categoriaSlug
    ? categoriaSlug.replace(/-/g, " ")
    : null;

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">

      {/* BREADCRUMBS */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categorías", href: "/categorias" },
          categoriaNombre && categoriaSlug
            ? { label: categoriaNombre, href: `/categorias/${categoriaSlug}` }
            : null,
          { label: producto.nombre }
        ].filter(Boolean) as any}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* IMAGEN PRINCIPAL */}
        <div>
          <img
            src={producto.imagen_principal}
            alt={producto.nombre}
            className="w-full rounded-xl shadow-md"
          />
        </div>

        {/* INFORMACIÓN DEL PRODUCTO */}
        <div>
          <h1 className="text-3xl font-semibold mb-4">{producto.nombre}</h1>

          {/* PRECIO */}
          <div className="mb-6">
            <p className="text-2xl font-bold text-pink-600">
              S/ {producto.precio_venta_soles}
            </p>

            {producto.precio_mercado && (
              <p className="text-gray-500 line-through">
                S/ {producto.precio_mercado}
              </p>
            )}

            {producto.descuento_porcentaje > 0 && (
              <p className="text-green-600 font-semibold">
                -{producto.descuento_porcentaje}% de descuento
              </p>
            )}
          </div>

          {/* DESCRIPCIÓN */}
          <p className="text-gray-700 mb-8 leading-relaxed">
            {producto.descripcion}
          </p>

          {/* BOTÓN */}
          <button className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition">
            Agregar al carrito
          </button>
        </div>
      </div>
    </main>
  );
}
