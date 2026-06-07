export const dynamic = "force-dynamic";

async function getProductos() {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (!backend) return [];

  try {
    const res = await fetch(`${backend}/api/productos/`, {
      cache: "no-store",
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error("Error cargando productos", e);
    return [];
  }
}

export default async function ProductosPage() {
  const productos = await getProductos();

  // 🔥 Filtramos productos sin ID para evitar /undefined
  const productosValidos = productos.filter(
    (p: any) => p.id !== undefined && p.id !== null
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-10">Todos los Productos</h1>

      {productosValidos.length === 0 && (
        <p className="text-gray-600">No hay productos disponibles.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {productosValidos.map((producto: any) => (
          <a
            key={producto.id}
            href={`/productos/${producto.id}`}
            className="block bg-white rounded-xl shadow hover:shadow-lg transition p-4"
          >
            <img
              src={
                producto.imagen_principal && producto.imagen_principal !== ""
                  ? producto.imagen_principal
                  : "/placeholder.png"
              }
              alt={producto.nombre}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />

            <h2 className="text-lg font-semibold">{producto.nombre}</h2>

            <p className="text-pink-600 font-bold mt-2">
              S/ {producto.precio_venta_soles}
            </p>

            {producto.precio_mercado_soles > 0 && (
              <p className="text-gray-500 line-through text-sm">
                S/ {producto.precio_mercado_soles}
              </p>
            )}
          </a>
        ))}
      </div>
    </main>
  );
}
