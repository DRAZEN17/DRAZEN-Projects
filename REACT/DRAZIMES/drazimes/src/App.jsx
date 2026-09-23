import { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollSmoother, ScrollTrigger } from "gsap/all";

import NavBar from "./components/NavBar";
import MenuOverlay from "./components/MenuOverlay";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

// Resets scroll and re-measures ScrollTrigger positions on every route
// change. ScrollSmoother itself is created once (below) and left running —
// only the trigger positions need refreshing once the new page has painted.
const ScrollManager = () => {
  const location = useLocation();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    ScrollSmoother.get()?.scrollTo(0, false);
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  return null;
};

function App() {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(
    () => {
      const smoother = ScrollSmoother.create({
        wrapper: wrapperRef.current,
        content: contentRef.current,
        smooth: 1.2,
        effects: true,
        smoothTouch: 0.1,
      });
      return () => smoother.kill();
    },
    { dependencies: [] }
  );

  return (
    <>
      <NavBar />
      <MenuOverlay />
      <CartDrawer />
      <ScrollManager />
      <div id="smooth-wrapper" ref={wrapperRef}>
        <div id="smooth-content" ref={contentRef}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/account" element={<Account />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
