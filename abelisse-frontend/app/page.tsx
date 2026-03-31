import HeroPremium from "@/components/HeroPremium";
import ProductCardPremium from "@/components/ProductCardPremium";
import CategoryCardPremium from "@/components/CategoryCardPremium";

// 🔥 Nuevo fetch: productos destacados
async function getFeatured() {
  const res = await fetch("http://127.0.0.1:8000/api/productos-destacados/", {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Error al cargar productos destacados");
    return {
      mas_vendidos: [],
      mas_buscados: [],
      nuevos: [],
      mejor_calificados: [],
    };
  }

  return res.json();
}

export default async function Home() {
  const destacados = await getFeatured();

  const masVendidos = destacados.mas_vendidos || [];
  const masBuscados = destacados.mas_buscados || [];
  const nuevos = destacados.nuevos || [];
  const mejorCalificados = destacados.mejor_calificados || [];

  // ⭐ CATEGORÍAS CON SLUG
  const categorias = [
    { nombre: "Maquillaje", slug: "maquillaje" },
    { nombre: "Cuidado Facial", slug: "cuidado-facial" },
    { nombre: "Cabello", slug: "cabello" },
    { nombre: "Cuidado Corporal", slug: "cuidado-corporal" },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO PREMIUM */}
      <HeroPremium />

      {/* CATEGORÍAS PREMIUM */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Categorías principales
          </h2>

          <p className="text-center text-black mb-10">
            Encuentra lo que necesitas según tu rutina de belleza.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categorias.map((cat) => (
              <CategoryCardPremium
                key={cat.slug}
                nombre={cat.nombre}
                slug={cat.slug}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 🔥 MÁS VENDIDOS */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Más vendidos</h2>
            <a href="/productos" className="text-sm text-pink-600 hover:underline">
              Ver todos
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {masVendidos.map((p: any) => (
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
        </div>
      </section>

      {/* 🔍 MÁS BUSCADOS */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Más buscados</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {masBuscados.map((p: any) => (
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
        </div>
      </section>

      {/* 🆕 PRODUCTOS NUEVOS */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Nuevos</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {nuevos.map((p: any) => (
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
        </div>
      </section>

      {/* ⭐ MEJOR CALIFICADOS */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Mejor calificados</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mejorCalificados.map((p: any) => (
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
        </div>
      </section>
    </main>
  );
}
