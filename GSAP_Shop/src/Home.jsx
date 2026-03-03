import React, { useState, useEffect, useRef, useMemo } from "react";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import useGsap from "./hooks/useGsap";
import { CATEGORIES, ALL_PRODUCTS } from "./data";

export default function Home() {
	const gsapReady = useGsap();
	const [products] = useState(ALL_PRODUCTS);
	const [cart, setCart] = useState([]);
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [visibleCount, setVisibleCount] = useState(12);

	const heroRef = useRef(null);
	const gridRef = useRef(null);

	const filteredProducts = useMemo(() => {
		let result = products;
		if (selectedCategory !== "all") {
			result = result.filter((p) => p.category === selectedCategory);
		}
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
		}
		return result;
	}, [selectedCategory, searchQuery, products]);

	useEffect(() => {
		if (gsapReady && heroRef.current) {
			const tl = window.gsap.timeline();
			tl.fromTo(heroRef.current.querySelector("h1"), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
				.fromTo(heroRef.current.querySelector("p"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
				.fromTo(heroRef.current.querySelector(".hero-btn"), { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }, "-=0.4");
		}
	}, [gsapReady]);

	useEffect(() => {
		if (gsapReady && gridRef.current) {
			window.gsap.fromTo(gridRef.current.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out", clearProps: "all" });
		}
	}, [filteredProducts.length, selectedCategory, gsapReady, visibleCount]);

	const addToCart = (product) => {
		setCart((prev) => {
			const existing = prev.find((item) => item.id === product.id);
			if (existing) return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
			return [...prev, { ...product, quantity: 1 }];
		});

		const btn = document.getElementById("cart-btn");
		if (gsapReady && btn) {
			window.gsap.fromTo(btn, { scale: 1 }, { scale: 1.2, duration: 0.15, yoyo: true, repeat: 1 });
		}
	};

	const updateQuantity = (id, change) => {
		setCart((prev) => prev.map((item) => {
			if (item.id === id) {
				const newQty = item.quantity + change;
				return newQty > 0 ? { ...item, quantity: newQty } : item;
			}
			return item;
		}));
	};

	const removeItem = (id) => setCart((prev) => prev.filter((item) => item.id !== id));
	const loadMore = () => setVisibleCount((prev) => Math.min(prev + 12, filteredProducts.length));

	return (
		<div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
			<NavBar setSelectedCategory={setSelectedCategory} searchQuery={searchQuery} setSearchQuery={setSearchQuery} cart={cart} setIsCartOpen={setIsCartOpen} />

			<Hero heroRef={heroRef} setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} CATEGORIES={CATEGORIES} />

			<MainContent filteredProducts={filteredProducts} visibleCount={visibleCount} gridRef={gridRef} addToCart={addToCart} gsapReady={gsapReady} loadMore={loadMore} selectedCategory={selectedCategory} CATEGORIES={CATEGORIES} />

			<Footer setSelectedCategory={setSelectedCategory} CATEGORIES={CATEGORIES} />

			<CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} updateQuantity={updateQuantity} removeItem={removeItem} gsapReady={gsapReady} />
		</div>
	);
}

