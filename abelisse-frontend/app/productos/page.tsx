export const dynamic = "force-dynamic";

import ProductCardPremium from "@/components/ProductCardPremium";
import { getProductos } from "@/lib/api";

export default async function ProductosPage() {
  const productos = await getProductos();

  const productosValidos = Array.isArray(productos)
    ? productos.filter((p: any) => {
        const id = Number(p.id ?? p.pk);
        return id && !isNaN(id) && id > 0;
      })
    : [];

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-10">Todos los Productos</h1>

      {productosValidos.length === 0 && (
        <p className="text-gray-600">No hay productos disponibles.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {productosValidos.map((producto: any) => {
          const id = producto.id ?? producto.pk;

          return (
            <ProductCardPremium
              key={id}
              id={id}
              nombre={producto.nombre}
              precio_venta_soles={producto.precio_venta_soles}
              precio_mercado_soles={producto.precio_mercado_soles}
              descuento_porcentaje={producto.descuento_porcentaje}
              imagen_principal={producto.imagen_principal}
              imagen_secundaria={producto.imagen_secundaria}
              imagen_terciaria={producto.imagen_terciaria}
              precio_venta_usd={producto.precio_venta_usd}
              descripcion={producto.descripcion}
              calificacion_promedio={producto.calificacion_promedio}
            />
          );
        })}
      </div>
    </main>
  );
}
