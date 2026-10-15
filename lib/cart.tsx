"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PHONES } from "./products";
import type { Phone } from "./types";

export interface CartItem { sku: string; qty: number; }
export interface ResolvedItem { phone: Phone; variant: Phone["variants"][number]; qty: number; }

export const FREE_DELIVERY_THRESHOLD = 50000;
export const DELIVERY_FEE = 350;
export const deliveryFor = (subtotal: number) =>
  subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;

interface CartApi {
  items: ResolvedItem[];
  count: number;
  subtotal: number;
  add: (sku: string, qty?: number) => void;
  setQty: (sku: string, qty: number) => void;
  remove: (sku: string) => void;
  clear: () => void;
}
const Ctx = createContext<CartApi | null>(null);
const KEY = "mobilebazaar-cart-v1";

export function resolveItems(raw: CartItem[]): ResolvedItem[] {
  const out: ResolvedItem[] = [];
  for (const item of raw) {
    for (const phone of PHONES) {
      const variant = phone.variants.find((v) => v.sku === item.sku);
      if (variant) { out.push({ phone, variant, qty: item.qty }); break; }
    }
  }
  return out;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setRaw(JSON.parse(saved) as CartItem[]);
    } catch { /* storage unavailable — cart simply starts empty */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) { try { localStorage.setItem(KEY, JSON.stringify(raw)); } catch { /* ignore */ } }
  }, [raw, loaded]);

  const api = useMemo<CartApi>(() => {
    const items = resolveItems(raw);
    return {
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.qty * i.variant.pricePkr, 0),
      add: (sku, qty = 1) =>
        setRaw((prev) => {
          const found = prev.find((i) => i.sku === sku);
          if (found) return prev.map((i) => (i.sku === sku ? { ...i, qty: Math.min(i.qty + qty, 5) } : i));
          return [...prev, { sku, qty }];
        }),
      setQty: (sku, qty) =>
        setRaw((prev) => qty <= 0 ? prev.filter((i) => i.sku !== sku)
          : prev.map((i) => (i.sku === sku ? { ...i, qty: Math.min(qty, 5) } : i))),
      remove: (sku) => setRaw((prev) => prev.filter((i) => i.sku !== sku)),
      clear: () => setRaw([]),
    };
  }, [raw]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
