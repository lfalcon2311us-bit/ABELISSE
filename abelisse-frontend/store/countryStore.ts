"use client";

import { create } from "zustand";
import { useEffect } from "react";

type Currency = "PEN" | "USD";

interface CountryState {
  country: string | null;
  currency: Currency;
  loading: boolean;
  setCountry: (country: string | null) => void;
}

export const useCountryStore = create<CountryState>((set) => ({
  country: null,
  currency: "USD",
  loading: true,

  setCountry: (country: string | null) =>
    set({
      country,
      currency: country === "PE" ? "PEN" : "USD",
      loading: false,
    }),
}));

export function useDetectCountry() {
  const setCountry = useCountryStore((s) => s.setCountry);

  useEffect(() => {
    try {
      // 1. Revisar localStorage
      const cached = localStorage.getItem("abelisse-country");
      if (cached && typeof cached === "string") {
        setCountry(cached);
        return;
      }
    } catch {
      // Si localStorage falla, seguimos sin romper nada
    }

    async function detect() {
      try {
        const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!backend) {
          console.error("❌ Falta NEXT_PUBLIC_BACKEND_URL");
          setCountry(null);
          return;
        }

        const res = await fetch(`${backend}/api/geo/`, {
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("❌ Error en respuesta GEO:", res.status);
          setCountry(null);
          return;
        }

        const data = await res.json();

        if (data && typeof data.country === "string") {
          localStorage.setItem("abelisse-country", data.country);
          setCountry(data.country);
        } else {
          setCountry(null);
        }
      } catch (e) {
        console.error("❌ Error detectando país:", e);
        setCountry(null);
      }
    }

    detect();
  }, [setCountry]);
}
