"use client";

import { create } from "zustand";

// Tipo de cada producto dentro del carrito
interface CartItem {
  id: number;
  nombre: string;
  imagen_principal: string | null;
  quantity: number;
  precio_soles: number;
  precio_usd: number;
}

// Tipo del estado del store
interface CartState {
  cart: CartItem[];
  addToCart: (product: {
    id: number;
    nombre: string;
    imagen_principal: string | null;
    precio_venta_soles: number;
    precio_venta_usd?: number;
  }) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],

  addToCart: (product) =>
    set((state) => {
      const exists = state.cart.find((p) => p.id === product.id);

      if (exists) {
        return {
          cart: state.cart.map((p) =>
            p.id === product.id
              ? { ...p, quantity: p.quantity + 1 }
              : p
          ),
        };
      }

      return {
        cart: [
          ...state.cart,
          {
            id: product.id,
            nombre: product.nombre,
            imagen_principal: product.imagen_principal,
            quantity: 1,

            // Guardamos ambas monedas SIEMPRE
            precio_soles: Number(product.precio_venta_soles),
            precio_usd: Number(
              product.precio_venta_usd ??
                Number(product.precio_venta_soles) / 3.5
            ),
          },
        ],
      };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((p) => p.id !== id),
    })),

  clearCart: () => set({ cart: [] }),
}));
