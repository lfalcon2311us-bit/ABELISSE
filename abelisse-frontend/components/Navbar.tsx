"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/ofertas", label: "Ofertas" },
  { href: "/categorias", label: "Categorías" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 gap-4">
        
        {/* TEXTO ABELISSE */}
        <Link
          href="/"
          className="text-2xl font-semibold tracking-[0.25em]"
          style={{ color: "#2A2A2A" }}
        >
          ABELISSE
        </Link>

        {/* Buscador */}
        <div className="hidden md:flex flex-1 max-w-md">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="
              w-full px-4 py-2 
              rounded-full 
              border border-gray-400 
              bg-gray-100 
              text-sm text-gray-800 
              placeholder-gray-500
              focus:outline-none 
              focus:ring-2 
              focus:ring-pink-500 
              focus:border-pink-500
            "
          />
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 text-sm md:text-base">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1 rounded-full transition ${
                  active
                    ? "bg-pink-500 text-white"
                    : "text-gray-700 hover:bg-pink-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Carrito */}
          <Link
            href="/carrito"
            className="ml-2 px-4 py-1.5 rounded-full border border-pink-500 text-pink-600 text-sm hover:bg-pink-50 transition"
          >
            Carrito
          </Link>
        </div>
      </nav>
    </header>
  );
}
