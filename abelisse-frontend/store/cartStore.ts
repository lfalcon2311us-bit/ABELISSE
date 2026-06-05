"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Tipo de cada producto dentro del carrito
interface CartItem {
  id: number;
  nombre: string;
  imagen_principal: string | null;
  quantity: number;
  precio_soles: number;
  precio_usd: number;
}

// Tipo del payload que recibe addToCart
interface AddProductPayload {
  id: number;
  nombre: string;
  imagen_principal: string | null;
  precio_venta_soles: number | string | null;
  precio_venta_usd?: number | string | null;
}

// Tipo del estado del store
interface CartState {
  cart: CartItem[];

  addToCart: (product: AddProductPayload) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;

  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) =>
        set((state) => {
          const exists = state.cart.find((p) => p.id === product.id);

          // Conversión segura
          const precioSoles = Number(product.precio_venta_soles ?? 0);
          const precioUSD = Number(
            product.precio_venta_usd ??
              (precioSoles > 0 ? precioSoles / 3.5 : 0)
          );

          // Evitar NaN
          const safeSoles = Number.isFinite(precioSoles) ? precioSoles : 0;
          const safeUSD = Number.isFinite(precioUSD) ? precioUSD : 0;

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
                precio_soles: safeSoles,
                precio_usd: safeUSD,
              },
            ],
          };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((p) => p.id !== id),
        })),

      clearCart: () => set({ cart: [] }),

      increaseQuantity: (id) =>
        set((state) => ({
          cart: state.cart.map((p) =>
            p.id === id ? { ...p, quantity: p.quantity + 1 } : p
          ),
        })),

      decreaseQuantity: (id) =>
        set((state) => {
          const item = state.cart.find((p) => p.id === id);
          if (!item) return state;

          if (item.quantity === 1) {
            return {
              cart: state.cart.filter((p) => p.id !== id),
            };
          }

          return {
            cart: state.cart.map((p) =>
              p.id === id ? { ...p, quantity: p.quantity - 1 } : p
            ),
          };
        }),
    }),
    {
      name: "abelisse-cart",
      version: 2,

      // Limpieza automática de datos corruptos
      migrate: (persistedState: any) => {
        if (!persistedState?.cart) return { cart: [] };

        const cleaned = persistedState.cart.filter((item: any) => {
          return (
            item &&
            Number.isFinite(item.precio_soles) &&
            Number.isFinite(item.precio_usd) &&
            item.quantity > 0
          );
        });

        return { ...persistedState, cart: cleaned };
      },
    }
  )
);
