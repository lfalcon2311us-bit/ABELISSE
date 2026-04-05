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

// 🔥 Detección REAL del país desde tu backend (sin CORS)
export function useDetectCountry() {
  const setCountry = useCountryStore((s) => s.setCountry);

  useEffect(() => {
    async function detect() {
      try {
        const res = await fetch(
          "https://abelisse-backend.onrender.com/api/geo/"
        );

        const data = await res.json();

        if (data && data.country) {
          setCountry(data.country);
        } else {
          setCountry(null);
        }
      } catch (e) {
        setCountry(null);
      }
    }

    detect();
  }, [setCountry]);
}
