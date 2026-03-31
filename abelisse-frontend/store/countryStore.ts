"use client";

import { create } from "zustand";
import { useEffect } from "react";

type Currency = "PEN" | "USD";

interface CountryState {
  country: string | null;
  currency: Currency;
  loading: boolean;
  setCountry: (country: string) => void;
}

export const useCountryStore = create<CountryState>((set) => ({
  country: null,
  currency: "USD", // Por defecto USD
  loading: true,

  setCountry: (country: string) =>
    set({
      country,
      currency: country === "PE" ? "PEN" : "USD",
      loading: false,
    }),
}));

// 🔥 Hook que detecta el país automáticamente
export function useDetectCountry() {
  const setCountry = useCountryStore((s) => s.setCountry);

  useEffect(() => {
    async function detect() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        // Si la API devuelve país, lo usamos
        setCountry(data.country || "US");
      } catch (e) {
        // Si falla, asumimos USD
        setCountry("US");
      }
    }

    detect();
  }, [setCountry]);
}
