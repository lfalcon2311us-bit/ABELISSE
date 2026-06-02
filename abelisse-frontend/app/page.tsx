import HeroPremium from "@/components/HeroPremium";
import ProductCardPremium from "@/components/ProductCardPremium";
import CategoryCardPremium from "@/components/CategoryCardPremium";

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

export default async function Home() {
  // 🔥 Un solo fetch
  const productos = await getProductos();

  // 🔥 Cálculos desde el array
  const masVendidos = [...productos]
    .sort((a, b) => b.ventas_totales - a.ventas_totales)
    .slice(0, 6);

  const masBuscados = [...productos]
    .sort((a, b) => b.busquedas_totales - a.busquedas_totales)
    .slice(0, 6);

  const nuevos = [...productos]
    .sort(
      (a, b) =>
        new Date(b.fecha_creacion).getTime() -
        new Date(a.fecha_creacion).getTime()
    )
    .slice(0, 6);

  const mejorCalificados = [...productos]
    .sort((a, b) => b.calificacion_promedio - a.calificacion_promedio)
    .slice(0, 6);

  const categorias = [
    { nombre: "Maquillaje", slug: "maquillaje" },
    { nombre: "Cuidado Facial", slug: "cuidado-facial" },
    { nombre: "Cabello", slug: "cabello" },
    { nombre: "Cuidado Corporal", slug: "cuidado-corporal" },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <HeroPremium />

      {/* CATEGORÍAS */}
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

      {/* MÁS VENDIDOS */}
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
              <ProductCardPremium key={p.id} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* MÁS BUSCADOS */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Más buscados</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {masBuscados.map((p: any) => (
              <ProductCardPremium key={p.id} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* NUEVOS */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Nuevos</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {nuevos.map((p: any) => (
              <ProductCardPremium key={p.id} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* MEJOR CALIFICADOS */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Mejor calificados</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mejorCalificados.map((p: any) => (
              <ProductCardPremium key={p.id} {...p} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
