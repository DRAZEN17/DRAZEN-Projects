import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { readStorage, writeStorage } from "../lib/storage";

const AccountContext = createContext(null);

/**
 * This is a demo "session," not real authentication — there's no backend
 * to verify a password against, so signing in just saves a display name
 * (and optional email) locally. It exists purely to personalize the site
 * (greet the user, keep a lightweight order history) — never present this
 * as secure or treat it as a real account system.
 */
export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState(() => readStorage("account", null));
  const [orders, setOrders] = useState(() => readStorage("orders", []));

  useEffect(() => {
    writeStorage("account", account);
  }, [account]);

  useEffect(() => {
    writeStorage("orders", orders);
  }, [orders]);

  const signIn = useCallback(({ name, email }) => {
    setAccount({ name, email: email || "" });
  }, []);

  const signOut = useCallback(() => {
    setAccount(null);
  }, []);

  const recordOrder = useCallback((order) => {
    setOrders((prev) => [order, ...prev].slice(0, 20));
  }, []);

  const value = useMemo(
    () => ({ account, isSignedIn: !!account, signIn, signOut, orders, recordOrder }),
    [account, signIn, signOut, orders, recordOrder]
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};

export const useAccount = () => {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used within an AccountProvider");
  return ctx;
};
