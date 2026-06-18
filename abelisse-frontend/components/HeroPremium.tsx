"use client";

import Image from "next/image";

export default function HeroPremium() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-pink-100 to-white py-24">

      {/* Fondo decorativo */}
      <div
        className="
          absolute inset-0 opacity-30 
          bg-[url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=60')] 
          bg-cover bg-center blur-sm
        "
      />

      {/* Overlay suave */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />

      <div className="relative max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Texto */}
        <div className="animate-[fadeIn_1s_ease]">
          <p className="uppercase tracking-[0.3em] text-xs text-pink-600 mb-4">
            cosmética & belleza
          </p>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight text-gray-900 drop-shadow-sm">
            Belleza que realza tu esencia
          </h1>

          <p className="text-gray-700 mb-8 text-lg leading-relaxed">
            Productos seleccionados para iluminar tu mejor versión.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/productos"
              aria-label="Explorar productos"
              className="
                px-8 py-3 bg-pink-500 text-white rounded-full text-sm font-medium 
                hover:bg-pink-600 shadow-md hover:shadow-lg 
                transition-all duration-300
              "
            >
              Explorar productos
            </a>

            <a
              href="/ofertas"
              aria-label="Ver ofertas"
              className="
                px-8 py-3 border border-pink-400 text-pink-600 rounded-full text-sm font-medium 
                hover:bg-pink-50 hover:border-pink-500 
                transition-all duration-300
              "
            >
              Ver ofertas
            </a>
          </div>
        </div>

        {/* Imagen */}
        <div className="flex justify-center md:justify-end animate-[float_4s_ease-in-out_infinite]">
          <div className="w-[260px] h-[260px] rounded-full flex items-center justify-center overflow-hidden bg-transparent shadow-xl shadow-pink-200/40">
            <Image
              src="/logo.png"
              alt="Logo ABELISSE"
              width={260}
              height={260}
              priority
              className="object-contain drop-shadow-lg"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
