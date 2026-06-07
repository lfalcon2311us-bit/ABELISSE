"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useCountryStore, useDetectCountry } from "@/store/countryStore";

interface Props {
  id: number;
  nombre: string;
  precio_venta_soles: number | string | null;
  precio_mercado_soles: number | string | null;
  descuento_porcentaje: number | string | null;

  imagen_principal: string | null;
  imagen_secundaria?: string | null;
  imagen_terciaria?: string | null;

  precio_venta_usd?: number | string | null;
  descripcion?: string;
  calificacion_promedio?: number | null;
}

export default function ProductCardPremium(props: Props) {
  const {
    id,
    nombre,
    precio_venta_soles,
    precio_mercado_soles,
    descuento_porcentaje,

    imagen_principal,
    imagen_secundaria,
    imagen_terciaria,

    precio_venta_usd,
    descripcion = "",
    calificacion_promedio = 0,
  } = props;

  // ⭐ Armamos el array de imágenes (solo válidas)
  const imagenes = [
    imagen_principal,
    imagen_secundaria,
    imagen_terciaria,
  ].filter((img) => img && img.trim() !== "") as string[];

  // ⭐ Estado del carrusel
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // ⭐ Reset del índice si cambia la cantidad de imágenes
  useEffect(() => {
    setIndex(0);
  }, [imagenes.length]);

  // ⭐ Autoplay inteligente
  useEffect(() => {
    if (imagenes.length <= 1 || paused) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % imagenes.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [imagenes.length, paused]);

  const [showFullDesc, setShowFullDesc] = useState(false);

  useDetectCountry();
  const { currency } = useCountryStore();

  const addToCart = useCartStore((state) => state.addToCart);

  const isPeru = currency === "PEN";
  const symbol = isPeru ? "S/" : "$";

  const precioSoles = Number(precio_venta_soles ?? 0);
  const precioMercado = Number(precio_mercado_soles ?? 0);
  const precioUSD = Number(precio_venta_usd ?? precioSoles / 3.5);
  const descuento = Number(descuento_porcentaje ?? 0);

  const priceDisplay = isPeru ? precioSoles : precioUSD;
  const marketPriceDisplay =
    precioMercado > 0 ? (isPeru ? precioMercado : precioMercado / 3.5) : 0;

  const shortDescription =
    descripcion.length > 120
      ? descripcion.slice(0, 120) + "..."
      : descripcion;

  const rating = Number(calificacion_promedio ?? 0);
  const roundedRating = Math.round(rating);

  return (
    <Link href={`/productos/${id}`} className="block">
      <div className="product-card-premium bg-white rounded-xl shadow-sm hover:shadow-xl transition border border-transparent overflow-hidden group">

        {/* 🔥 CARRUSEL DE IMÁGENES */}
        <div
          className="relative w-full h-56 overflow-hidden bg-gray-100 flex items-center justify-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <Image
            src={imagenes[index] || "/placeholder.png"}
            alt={nombre}
            width={400}
            height={400}
            unoptimized
            className="w-full h-full object-cover transition-all duration-500"
          />

          {/* Botón anterior */}
          {imagenes.length > 1 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setIndex((index - 1 + imagenes.length) % imagenes.length);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white px-2 py-1 rounded-full shadow"
            >
              ‹
            </button>
          )}

          {/* Botón siguiente */}
          {imagenes.length > 1 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setIndex((index + 1) % imagenes.length);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white px-2 py-1 rounded-full shadow"
            >
              ›
            </button>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold mb-1">{nombre}</h3>

          {/* ⭐ Rating */}
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-yellow-400 text-sm">
                {i < roundedRating ? "★" : "☆"}
              </span>
            ))}
            <span className="text-xs text-gray-500 ml-1">
              {rating.toFixed(1)} / 5
            </span>
          </div>

          {/* ⭐ Descripción */}
          <p
            className="text-sm text-gray-600 mb-3 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setShowFullDesc(!showFullDesc);
            }}
          >
            {showFullDesc ? descripcion : shortDescription}
          </p>

          {/* ⭐ Precios */}
          <div className="mb-4">
            <p className="text-pink-600 font-semibold text-lg">
              {symbol} {priceDisplay.toFixed(2)}
            </p>

            {marketPriceDisplay > 0 && (
              <p className="text-gray-500 line-through text-sm">
                {symbol} {marketPriceDisplay.toFixed(2)}
              </p>
            )}

            {descuento > 0 && (
              <p className="text-green-600 text-sm font-medium">
                -{descuento}% OFF
              </p>
            )}
          </div>

          {/* ⭐ Botón */}
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart({
                id,
                nombre,
                precio_venta_soles: precioSoles,
                precio_venta_usd: precioUSD,
                imagen_principal: imagen_principal || "",
              });
            }}
            className="w-full text-sm px-4 py-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition"
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </Link>
  );
}
