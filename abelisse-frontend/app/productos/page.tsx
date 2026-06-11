export const dynamic = "force-dynamic";

import ProductCardPremium from "@/components/ProductCardPremium";

async function getProductos() {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (!backend) return [];

  try {
    const cleanBackend = backend.replace(/\/$/, "");

    const res = await fetch(`${cleanBackend}/api/productos/`, {
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

  // 🔥 Filtramos productos con ID válido
  const productosValidos = productos.filter((p: any) => {
    const id = Number(p.id ?? p.pk);
    return id && !isNaN(id) && id > 0;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-10">Todos los Productos</h1>

      {productosValidos.length === 0 && (
        <p className="text-gray-600">No hay productos disponibles.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {productosValidos.map((producto: any) => {
          const id = producto.id ?? producto.pk;

          // 🔥 FIX: extraer imágenes desde producto.stock
          const stock = producto.stock ?? {};

          return (
            <ProductCardPremium
              key={id}
              id={id}
              nombre={producto.nombre}
              precio_venta_soles={stock.precio_venta_soles}
              precio_mercado_soles={stock.precio_mercado_soles}
              descuento_porcentaje={stock.descuento_porcentaje}
              imagen_principal={stock.imagen_principal}
              imagen_secundaria={stock.imagen_secundaria}
              imagen_terciaria={stock.imagen_terciaria}
              precio_venta_usd={stock.precio_venta_usd}
              descripcion={producto.descripcion}
              calificacion_promedio={producto.calificacion_promedio}
            />
          );
        })}
      </div>
    </main>
  );
}
