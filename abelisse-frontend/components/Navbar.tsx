"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/ofertas", label: "Ofertas" },
  { href: "/categorias", label: "Categorías" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const pathname = usePathname();
  const cart = useCartStore((state) => state.cart);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-semibold tracking-[0.25em] text-gray-900"
        >
          ABELISSE
        </Link>

        {/* BOTÓN HAMBURGUESA (MÓVIL) */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-700 text-xl"
        >
          ☰
        </button>

        {/* LINKS DESKTOP */}
        <div className="hidden md:flex items-center gap-4 text-sm md:text-base">
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
            className="ml-2 px-4 py-1.5 rounded-full border border-pink-500 text-pink-600 text-sm hover:bg-pink-50 transition flex items-center gap-2"
          >
            Carrito
            {cartCount > 0 && (
              <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* MENU MÓVIL */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-lg transition ${
                  active
                    ? "bg-pink-500 text-white"
                    : "text-gray-700 hover:bg-pink-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Carrito móvil */}
          <Link
            href="/carrito"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 rounded-lg border border-pink-500 text-pink-600 hover:bg-pink-50 transition flex items-center justify-between"
          >
            Carrito
            {cartCount > 0 && (
              <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      )}
    </header>
  );
}
