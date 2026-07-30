import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { readStorage, writeStorage } from "../lib/storage";

const RecentlyViewedContext = createContext(null);
const MAX_ITEMS = 8;

export const RecentlyViewedProvider = ({ children }) => {
  const [ids, setIds] = useState(() => readStorage("recently-viewed", []));

  useEffect(() => {
    writeStorage("recently-viewed", ids);
  }, [ids]);

  // Most-recent-first, de-duplicated, capped — viewing something already
  // in the list just moves it back to the front instead of listing twice.
  const recordView = useCallback((id) => {
    setIds((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, MAX_ITEMS));
  }, []);

  const value = useMemo(() => ({ ids, recordView }), [ids, recordView]);

  return <RecentlyViewedContext.Provider value={value}>{children}</RecentlyViewedContext.Provider>;
};

export const useRecentlyViewed = () => {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
  return ctx;
};
