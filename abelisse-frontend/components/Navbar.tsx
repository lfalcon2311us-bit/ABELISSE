"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/ofertas", label: "Ofertas" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const pathname = usePathname();

  const cart = useCartStore((state) => state.cart ?? []);
  const cartCount = cart.reduce((acc, item) => acc + (item.quantity ?? 0), 0);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const buscar = async () => {
    const q = query.trim().toLowerCase();
    if (!q) return;

    // 1. Obtener todos los productos
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/productos/`);
    const data = await res.json();

    // 2. Buscar coincidencias
    const encontrados = data.filter((p: any) =>
      p.nombre?.toLowerCase().includes(q) ||
      p.marca?.toLowerCase().includes(q) ||
      p.descripcion?.toLowerCase().includes(q)
    );

    // 3. Si NO existe → notificación en cualquier página
    if (encontrados.length === 0) {
      setNotFound(true);
      setTimeout(() => setNotFound(false), 3000);
      return;
    }

    // 4. Si existe → ir a /productos?q=
    window.location.href = `/productos?q=${q}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b shadow-sm">

      {/* 🔔 NOTIFICACIÓN PREMIUM GLOBAL */}
      {notFound && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-100 text-red-700 px-4 py-2 rounded-full shadow">
          Producto no encontrado
        </div>
      )}

      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO + BUSCADOR */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-2xl font-bold tracking-[0.25em] text-gray-900 hover:text-pink-600 transition"
          >
            ABELISSE
          </Link>

          {/* Barra de búsqueda premium */}
          <div className="hidden md:flex items-center gap-2">

            <input
              type="text"
              placeholder="Buscar productos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscar()}
              className="
                px-4 py-2 w-64 rounded-full 
                border border-gray-300 
                text-gray-700 placeholder-gray-400 bg-white
                focus:outline-none
                focus:ring-0
                focus:border-gray-300
                transition
              "
            />

            {/* Botón IR premium */}
            <button
              onClick={buscar}
              className="
                px-4 py-2 rounded-full 
                bg-white text-gray-900 
                hover:bg-gray-100 
                transition font-semibold
              "
            >
              IR
            </button>

          </div>
        </div>

        {/* BOTÓN HAMBURGUESA (MÓVIL) */}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="md:hidden text-gray-700 text-2xl hover:text-pink-600 transition"
        >
          {open ? "✕" : "☰"}
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
                    ? "bg-pink-500 text-white shadow"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Carrito */}
          <Link
            href="/carrito"
            className="
              ml-2 px-4 py-1.5 rounded-full border border-pink-500 
              text-pink-600 text-sm hover:bg-pink-50 hover:border-pink-600 
              transition flex items-center gap-2
            "
          >
            Carrito
            {cartCount > 0 && (
              <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full shadow">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
