"use client";

import Image from "next/image";

export default function HeroPremium() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-pink-100 to-white py-20">
      {/* Fondo decorativo */}
      <div
        className="
          absolute inset-0 opacity-30 
          bg-[url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=60')] 
          bg-cover bg-center blur-sm
        "
      ></div>

      <div className="relative max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Texto */}
        <div className="animate-fadeIn">
          <p className="uppercase tracking-[0.3em] text-xs text-pink-600 mb-3">
            cosmética & belleza
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Belleza que realza tu esencia
          </h1>

          <p className="text-black mb-6 text-lg">
            Productos seleccionados para iluminar tu mejor versión.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/productos"
              className="px-8 py-3 bg-pink-500 text-white rounded-full text-sm font-medium hover:bg-pink-600 transition"
            >
              Explorar productos
            </a>

            <a
              href="/ofertas"
              className="px-8 py-3 border border-pink-400 text-pink-600 rounded-full text-sm font-medium hover:bg-pink-50 transition"
            >
              Ver ofertas
            </a>
          </div>
        </div>

        {/* Imagen */}
        <div className="flex justify-center md:justify-end animate-float">
          <div className="w-[260px] h-[260px] rounded-full flex items-center justify-center overflow-hidden bg-transparent">
            <Image
              src="/logo.png"
              alt="Logo ABELISSE"
              width={260}
              height={260}
              priority
              className="object-contain"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
