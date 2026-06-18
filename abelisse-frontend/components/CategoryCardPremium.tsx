"use client";

import Link from "next/link";

interface Props {
  nombre: string;
  slug: string;
  icono?: string; // opcional
}

export default function CategoryCardPremium({ nombre, slug, icono }: Props) {
  return (
    <Link
      href={`/categorias/${slug}`}
      aria-label={`Ver productos de ${nombre}`}
      className="
        group
        p-6 bg-white rounded-xl shadow-sm 
        hover:shadow-lg hover:-translate-y-1 
        border border-gray-100 
        transition-all duration-300
        text-center cursor-pointer
      "
    >
      {/* Ícono o círculo */}
      <div
        className="
          w-16 h-16 mx-auto mb-3 rounded-full 
          bg-pink-100 flex items-center justify-center
          group-hover:bg-pink-200 
          transition-all duration-300
        "
      >
        {icono ? (
          <span className="text-2xl">{icono}</span>
        ) : (
          <span className="text-pink-500 text-xl font-bold">★</span>
        )}
      </div>

      {/* Nombre */}
      <p
        className="
          font-medium text-gray-700 
          group-hover:text-pink-600 
          transition-colors duration-300
          capitalize
        "
      >
        {nombre}
      </p>
    </Link>
  );
}
