import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

interface CartValue {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartValue | null>(null);
const STORAGE_KEY = "bmd-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  const value = useMemo<CartValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.qty * i.price, 0),
      add: (item, qty = 1) =>
        setItems((prev) => {
          const found = prev.find((p) => p.id === item.id);
          if (found) return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + qty } : p));
          return [...prev, { ...item, qty }];
        }),
      setQty: (id, qty) =>
        setItems((prev) =>
          prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p)),
        ),
      remove: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
      clear: () => setItems([]),
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}