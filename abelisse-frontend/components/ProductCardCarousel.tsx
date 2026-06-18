"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface CarouselProps {
  imagenes: string[];
  nombre: string;
}

export default function ProductCardCarousel({ imagenes, nombre }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setIndex(0);
  }, [imagenes.length]);

  useEffect(() => {
    if (imagenes.length <= 1 || paused) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % imagenes.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [imagenes.length, paused]);

  return (
    <div
      className="relative w-full h-56 overflow-hidden bg-gray-100 flex items-center justify-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Image
        key={imagenes[index] ?? "placeholder"}
        src={imagenes[index] ?? "/placeholder.png"}
        alt={nombre}
        width={400}
        height={400}
        unoptimized
        className="w-full h-full object-cover transition-all duration-500"
      />

      {imagenes.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIndex((index - 1 + imagenes.length) % imagenes.length);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white px-2 py-1 rounded-full shadow"
          >
            ‹
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              setIndex((index + 1) % imagenes.length);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white px-2 py-1 rounded-full shadow"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
