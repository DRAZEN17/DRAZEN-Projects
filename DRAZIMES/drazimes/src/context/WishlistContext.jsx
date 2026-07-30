import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { readStorage, writeStorage } from "../lib/storage";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [ids, setIds] = useState(() => readStorage("wishlist", []));

  useEffect(() => {
    writeStorage("wishlist", ids);
  }, [ids]);

  const toggle = useCallback((id) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const isWished = useCallback((id) => ids.includes(id), [ids]);

  const value = useMemo(
    () => ({ ids, toggle, isWished, count: ids.length }),
    [ids, toggle, isWished]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
};
