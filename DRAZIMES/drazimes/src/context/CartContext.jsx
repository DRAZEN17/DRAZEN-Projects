import { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";
import { readStorage, writeStorage } from "../lib/storage";

const CartContext = createContext(null);

const lineId = (productId, size) => `${productId}__${size ?? "_"}`;

export const CartProvider = ({ children }) => {
  const [lines, setLines] = useState(() => readStorage("cart", []));
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  // No backend, so "persistence" is local to this browser — refreshing or
  // coming back later keeps the cart instead of silently emptying it.
  useEffect(() => {
    writeStorage("cart", lines);
  }, [lines]);

  const addItem = useCallback((product, { size, qty = 1, price } = {}) => {
    setLines((prev) => {
      const id = lineId(product.id, size);
      const existing = prev.find((l) => l.id === id);
      if (existing) {
        return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l));
      }
      return [
        ...prev,
        {
          id,
          productId: product.id,
          brand: product.brand,
          title: product.title,
          price: price ?? product.price,
          thumbnail: product.thumbnail,
          category: product.category,
          size,
          qty,
        },
      ];
    });
    setCartOpen(true);
  }, []);

  const removeItem = useCallback((id) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
  }, []);

  const updateQty = useCallback((id, qty) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l))
    );
  }, []);

  const subtotal = useMemo(() => lines.reduce((sum, l) => sum + l.price * l.qty, 0), [lines]);
  const count = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const value = useMemo(
    () => ({
      lines,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      subtotal,
      count,
      isCartOpen,
      openCart,
      closeCart,
      isMenuOpen,
      openMenu,
      closeMenu,
    }),
    [
      lines,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      subtotal,
      count,
      isCartOpen,
      openCart,
      closeCart,
      isMenuOpen,
      openMenu,
      closeMenu,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
