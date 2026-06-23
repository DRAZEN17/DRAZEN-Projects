import { useState, useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import { CATEGORIES, ALL_PRODUCTS } from "./data";

const PAGE_SIZE = 12;

export default function Home() {
  const [products] = useState(ALL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Tracks which filter combination `visibleCount` was last set for. When
  // the active filter changes mid-render, we reset pagination right away
  // instead of doing it in a useEffect (which would cause an extra render).
  const [paginatedFor, setPaginatedFor] = useState("all|");

  const heroRef = useRef(null);
  const gridRef = useRef(null);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [selectedCategory, searchQuery, products]);

  const filterKey = `${selectedCategory}|${searchQuery}`;
  if (filterKey !== paginatedFor) {
    setPaginatedFor(filterKey);
    setVisibleCount(PAGE_SIZE);
  }

  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(".hero-title", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
        .fromTo(".hero-sub", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.5")
        .fromTo(".hero-depts", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.4");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!gridRef.current || gridRef.current.children.length === 0) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current.children,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.04, ease: "power2.out", clearProps: "all" }
      );
    });
    return () => ctx.revert();
  }, [filteredProducts.length, selectedCategory, visibleCount]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    const btn = document.getElementById("cart-btn");
    if (btn) {
      gsap.fromTo(btn, { scale: 1 }, { scale: 1.15, duration: 0.15, yoyo: true, repeat: 1 });
    }
  };

  const updateQuantity = (id, change) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const removeItem = (id) => setCart((prev) => prev.filter((item) => item.id !== id));
  const loadMore = () => setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredProducts.length));

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-stamp/20 selection:text-ink">
      <NavBar
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
      />

      <Hero
        heroRef={heroRef}
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        CATEGORIES={CATEGORIES}
        totalCount={products.length}
      />

      <MainContent
        filteredProducts={filteredProducts}
        visibleCount={visibleCount}
        gridRef={gridRef}
        addToCart={addToCart}
        loadMore={loadMore}
        selectedCategory={selectedCategory}
        CATEGORIES={CATEGORIES}
      />

      <Footer setSelectedCategory={setSelectedCategory} CATEGORIES={CATEGORIES} />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
      />
    </div>
  );
}
