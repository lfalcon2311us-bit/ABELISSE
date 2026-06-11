"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function CarouselProducto({
  imagenes,
  nombre,
}: {
  imagenes: string[];
  nombre: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setIndex(0);
  }, [imagenes.length]);

  useEffect(() => {
    if (imagenes.length <= 1 || paused) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % imagenes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [imagenes.length, paused]);

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden shadow-md bg-gray-100"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Image
        key={imagenes[index] ?? "placeholder"}
        src={imagenes[index] ?? "/placeholder.png"}
        alt={nombre}
        width={800}
        height={800}
        unoptimized
        className="w-full h-full object-cover transition-all duration-500"
      />

      {imagenes.length > 1 && (
        <>
          <button
            onClick={() =>
              setIndex((index - 1 + imagenes.length) % imagenes.length)
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white px-2 py-1 rounded-full shadow"
          >
            ‹
          </button>

          <button
            onClick={() => setIndex((index + 1) % imagenes.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white px-2 py-1 rounded-full shadow"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
