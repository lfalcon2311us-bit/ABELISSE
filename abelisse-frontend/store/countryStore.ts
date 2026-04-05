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
  currency: "USD", // default neutral
  loading: true,

  setCountry: (country: string | null) =>
    set({
      country,
      currency: country === "PE" ? "PEN" : "USD",
      loading: false,
    }),
}));

// 🔥 Detección real del país
export function useDetectCountry() {
  const setCountry = useCountryStore((s) => s.setCountry);

  useEffect(() => {
    async function detect() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        if (data && data.country) {
          setCountry(data.country);
        } else {
          setCountry(null); // no forzamos nada
        }
      } catch (e) {
        setCountry(null); // fallback neutral
      }
    }

    detect();
  }, [setCountry]);
}
