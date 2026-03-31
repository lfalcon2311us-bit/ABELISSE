"use client";

import Link from "next/link";

interface Props {
  nombre: string;
  slug: string;
}

export default function CategoryCardPremium({ nombre, slug }: Props) {
  return (
    <Link
      href={`/categorias/${slug}`}
      className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md border border-transparent transition text-center group"
    >
      <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-pink-100 group-hover:bg-pink-200 transition" />
      <p className="font-medium text-gray-700">{nombre}</p>
    </Link>
  );
}
