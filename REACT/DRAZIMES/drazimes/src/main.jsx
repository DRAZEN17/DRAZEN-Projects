import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { ProductsProvider } from "./context/ProductsContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { AccountProvider } from "./context/AccountContext.jsx";
import { RecentlyViewedProvider } from "./context/RecentlyViewedContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ProductsProvider>
        <AccountProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </RecentlyViewedProvider>
          </WishlistProvider>
        </AccountProvider>
      </ProductsProvider>
    </BrowserRouter>
  </StrictMode>
);
