"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CART_STORAGE_KEY,
  cartSubtotal,
  isAdaptationProduct,
  type CartItem,
  type CartProduct,
} from "@/lib/cart";

type CartContextValue = {
  items: CartItem[];
  addItem: (product: CartProduct, quantity?: number) => { ok: boolean; message?: string };
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((product: CartProduct, quantity = 1) => {
    const incomingIsAdaptation = isAdaptationProduct(product);
    let result: { ok: boolean; message?: string } = { ok: true };

    setItems((prev) => {
      const hasOther = prev.some(
        (i) => isAdaptationProduct(i.product) !== incomingIsAdaptation,
      );
      if (hasOther) {
        result = {
          ok: false,
          message: incomingIsAdaptation
            ? "Vehicle adaptations need their own checkout — clear your shop cart first."
            : "Your cart already has a vehicle adaptation — clear it before adding shop items.",
        };
        return prev;
      }

      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prev, { product, quantity }];
    });

    if (result.ok) setIsOpen(true);
    return result;
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.product.id !== productId);
      return prev.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i,
      );
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount: items.reduce((n, i) => n + i.quantity, 0),
      subtotal: cartSubtotal(items),
      isOpen,
      setIsOpen,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, isOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
