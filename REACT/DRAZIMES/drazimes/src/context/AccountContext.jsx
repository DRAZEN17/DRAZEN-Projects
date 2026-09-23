import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { readStorage, writeStorage } from "../lib/storage";

const AccountContext = createContext(null);

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState(() => readStorage("account", null));
  const [orders, setOrders] = useState(() => readStorage("orders", []));

  useEffect(() => {
    writeStorage("account", account);
  }, [account]);

  useEffect(() => {
    writeStorage("orders", orders);
  }, [orders]);

  const signIn = useCallback(({ name, email, password }) => {
    setAccount({ name, email: email || "", password: password || "" });
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
