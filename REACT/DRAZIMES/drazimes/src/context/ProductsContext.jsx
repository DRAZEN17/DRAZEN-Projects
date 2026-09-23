import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { fetchAllProducts } from "../lib/dummyjson";

const ProductsContext = createContext(null);

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const [error, setError] = useState(null);
  const [partial, setPartial] = useState(false);

  const load = useCallback(() => {
    setStatus("loading");
    setError(null);
    fetchAllProducts()
      .then(({ products: list, partial: hadPartialFailure }) => {
        setProducts(list);
        setPartial(hadPartialFailure);
        setStatus("ready");
      })
      .catch((err) => {
        setError(err.message || "Something went wrong loading products.");
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const getById = useCallback((id) => products.find((p) => p.id === id), [products]);

  const getRelated = useCallback(
    (product, count = 4) => {
      if (!product) return [];
      return products
        .filter((p) => p.id !== product.id && p.category === product.category)
        .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
        .slice(0, count);
    },
    [products]
  );

  const value = useMemo(
    () => ({
      products,
      loading: status === "loading",
      error: status === "error" ? error : null,
      partial,
      retry: load,
      getById,
      getRelated,
    }),
    [products, status, error, partial, load, getById, getRelated]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within a ProductsProvider");
  return ctx;
};
