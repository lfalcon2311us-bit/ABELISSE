"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: number;
  nombre: string;
  imagen_principal: string | null;
  quantity: number;
  precio_soles: number;
  precio_usd: number;
  stock: number;
}

interface AddProductPayload {
  id: number;
  nombre: string;
  imagen_principal: string | null;

  precio_venta_soles: number | string | null;
  precio_venta_usd?: number | string | null;

  stock?: number | null;

  // ⭐ AHORA SÍ: cantidad personalizada
  quantity?: number;
}

interface CartState {
  cart: CartItem[];

  addToCart: (product: AddProductPayload) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;

  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;

  removePaidItems: (paidItems: { id: number }[]) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      // ⭐ AHORA addToCart soporta quantity personalizada
      addToCart: (product) =>
        set((state) => {
          const exists = state.cart.find((p) => p.id === product.id);

          const precioSoles = Number(product.precio_venta_soles ?? 0);
          const precioUSD = Number(product.precio_venta_usd ?? 0);
          const safeSoles = Number.isFinite(precioSoles) ? precioSoles : 0;
          const safeUSD = Number.isFinite(precioUSD) ? precioUSD : 0;

          const safeStock = Number(product.stock ?? 0);
          const qty = Number(product.quantity ?? 1); // ⭐ cantidad enviada

          if (exists) {
            const nuevaCantidad = exists.quantity + qty;

            return {
              cart: state.cart.map((p) =>
                p.id === product.id
                  ? {
                      ...p,
                      quantity:
                        nuevaCantidad <= p.stock ? nuevaCantidad : p.stock,
                    }
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
                quantity: qty, // ⭐ cantidad inicial
                precio_soles: safeSoles,
                precio_usd: safeUSD,
                stock: safeStock,
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
            p.id === id && p.quantity < p.stock
              ? { ...p, quantity: p.quantity + 1 }
              : p
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

      removePaidItems: (paidItems) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) => !paidItems.some((p) => p.id === item.id)
          ),
        })),
    }),
    {
      name: "abelisse-cart",
      version: 5,

      migrate: (persistedState: any) => {
        if (!persistedState?.cart) return { cart: [] };

        const cleaned = persistedState.cart.map((item: any) => ({
          ...item,
          stock: Number.isFinite(item.stock) ? item.stock : 0,
        }));

        return { ...persistedState, cart: cleaned };
      },
    }
  )
);
