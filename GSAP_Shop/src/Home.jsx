import React, { useState, useEffect, useRef, useMemo } from "react";
import {
ShoppingCart,
Search,
X,
Star,
Plus,
Minus,
Trash2,
ArrowRight,
Package,
Loader2,
} from "lucide-react";

// --- Data Generation ---

const CATEGORIES = [
{
id: "tech",
name: "Electronics",
color: "3b82f6",
icon: "💻",
keywords: "technology,gadget",
},
{
id: "fashion",
name: "Fashion",
color: "ec4899",
icon: "👕",
keywords: "clothing,fashion",
},
{
id: "home",
name: "Home & Living",
color: "10b981",
icon: "🏠",
keywords: "furniture,interior",
},
{
id: "sports",
name: "Sports",
color: "f59e0b",
icon: "⚽",
keywords: "sports,fitness",
},
{
id: "toys",
name: "Toys & Hobbies",
color: "8b5cf6",
icon: "🎮",
keywords: "toy,game",
},
];

const ADJECTIVES = [
"Premium",
"Ultra",
"Smart",
"Ergonomic",
"Vintage",
"Modern",
"Durable",
"Sleek",
"Pro",
"Compact",
];

const NOUNS = {
tech: [
"Headphones",
"Laptop",
"Smartwatch",
"Camera",
"Keyboard",
"Mouse",
"Monitor",
"Speaker",
"Tablet",
"Drone",
],
fashion: [
"Jacket",
"Sneakers",
"Tshirt",
"Backpack",
"Sunglasses",
"Watch",
"Boots",
"Scarf",
"Jeans",
"Hat",
],
home: [
"Lamp",
"Chair",
"Vase",
"Planter",
"Rug",
"Pillow",
"Desk",
"Clock",
"Mirror",
"Sofa",
],
sports: [
"Yoga Mat",
"Dumbbell",
"Water Bottle",
"Running Shoes",
"Tennis Racket",
"Soccer Ball",
"Gym Bag",
"Fitness Tracker",
"Boxing Gloves",
"Bicycle",
],
toys: [
"Robot",
"Lego",
"Doll",
"Toy Car",
"Puzzle",
"Drone",
"Teddy Bear",
"Action Figure",
"Kite",
"Board Game",
],
};

const generateProducts = () => {
const products = [];
let idCounter = 1;

CATEGORIES.forEach((cat) => {
for (let i = 0; i < 20; i++) {
    const noun =
    NOUNS[cat.id][Math.floor(Math.random() * NOUNS[cat.id].length)];
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const price = Math.floor(Math.random() * 200) + 20;

    const imageKeyword = `${cat.keywords},${noun.replace(" ", "")}`;

    products.push({
    id: idCounter++,
    name: `${adj} ${noun}`,
    category: cat.id,
    price: price,
    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
    reviews: Math.floor(Math.random() * 500) + 10,
    image: `https://loremflickr.com/400/300/${encodeURIComponent(
        imageKeyword
    )}?lock=${idCounter}`,
    description: `Experience the best quality with our ${adj.toLowerCase()} ${noun.toLowerCase()}. Designed for the modern lifestyle and perfect for your daily needs.`,
    });
}
});

return products.sort(() => Math.random() - 0.5);
};

const ALL_PRODUCTS = generateProducts();

// --- Hook for loading GSAP ---
const useGsap = () => {
const [gsapLoaded, setGsapLoaded] = useState(false);

useEffect(() => {
if (window.gsap) {
    setGsapLoaded(true);
    return;
}

const script = document.createElement("script");
script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
script.async = true;
script.onload = () => setGsapLoaded(true);
document.body.appendChild(script);
}, []);

return gsapLoaded;
};

// --- Components ---

const CartDrawer = ({
isOpen,
onClose,
cart,
updateQuantity,
removeItem,
gsapReady,
}) => {
const drawerRef = useRef(null);
const overlayRef = useRef(null);

const subtotal = cart.reduce(
(sum, item) => sum + item.price * item.quantity,
0
);
const tax = subtotal * 0.08;
const total = subtotal + tax;

useEffect(() => {
if (!gsapReady || !drawerRef.current) return;

if (isOpen) {
    window.gsap.to(overlayRef.current, { autoAlpha: 1, duration: 0.3 });
    window.gsap.to(drawerRef.current, {
    x: "0%",
    duration: 0.4,
    ease: "power3.out",
    });
} else {
    window.gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.3 });
    window.gsap.to(drawerRef.current, {
    x: "100%",
    duration: 0.3,
    ease: "power3.in",
    });
}
}, [isOpen, gsapReady]);

return (
<div
    className={`fixed inset-0 z-50 ${
    isOpen ? "pointer-events-auto" : "pointer-events-none"
    }`}
>
    <div
    ref={overlayRef}
    className="absolute inset-0 bg-black/50 opacity-0 backdrop-blur-sm"
    onClick={onClose}
    />
    <div
    ref={drawerRef}
    className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform translate-x-full flex flex-col"
    >
    <div className="p-6 border-b flex justify-between items-center bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <ShoppingCart className="w-5 h-5" /> Your Cart
        </h2>
        <button
        onClick={onClose}
        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
        <X className="w-5 h-5" />
        </button>
    </div>

    <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {cart.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
            <Package className="w-16 h-16 opacity-50" />
            <p>Your cart is empty.</p>
            <button
            onClick={onClose}
            className="text-blue-600 font-medium hover:underline"
            >
            Start Shopping
            </button>
        </div>
        ) : (
        cart.map((item) => (
            <div
            key={item.id}
            className="flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm"
            >
            <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg bg-gray-100"
            />
            <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800 line-clamp-1">
                    {item.name}
                </h3>
                <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
                </div>
                <p className="text-blue-600 font-bold">${item.price}</p>
                <div className="flex items-center gap-3">
                <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                >
                    <Minus className="w-3 h-3" />
                </button>
                <span className="text-sm font-medium w-4 text-center">
                    {item.quantity}
                </span>
                <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                >
                    <Plus className="w-3 h-3" />
                </button>
                </div>
            </div>
            </div>
        ))
        )}
    </div>

    {cart.length > 0 && (
        <div className="p-6 border-t bg-gray-50 space-y-4">
        <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
            </div>
        </div>
        <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-transform active:scale-95 flex items-center justify-center gap-2">
            Checkout <ArrowRight className="w-4 h-4" />
        </button>
        </div>
    )}
    </div>
</div>
);
};

const ProductCard = ({ product, addToCart, gsapReady }) => {
const cardRef = useRef(null);
const [imageLoaded, setImageLoaded] = useState(false);

const handleMouseEnter = () => {
if (gsapReady && cardRef.current) {
    window.gsap.to(cardRef.current, {
    y: -8,
    scale: 1.02,
    duration: 0.3,
    ease: "power2.out",
    });
}
};

const handleMouseLeave = () => {
if (gsapReady && cardRef.current) {
    window.gsap.to(cardRef.current, {
    y: 0,
    scale: 1,
    duration: 0.3,
    ease: "power2.out",
    });
}
};

return (
<div
    ref={cardRef}
    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
>
    <div className="relative pt-[75%] bg-gray-100 overflow-hidden">
    {/* Loading Skeleton */}
    {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
    )}
    <img
        src={product.image}
        alt={product.name}
        className={`absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
        imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
    />
    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />{" "}
        {product.rating}
    </div>
    </div>

    <div className="p-5 flex flex-col flex-1">
    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">
        {CATEGORIES.find((c) => c.id === product.category)?.name}
    </div>
    <h3 className="font-bold text-gray-800 text-lg mb-2 leading-tight group-hover:text-blue-600 transition-colors">
        {product.name}
    </h3>
    <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
        {product.description}
    </p>

    <div className="flex items-center justify-between mt-auto">
        <span className="text-xl font-bold text-gray-900">
        ${product.price}
        </span>
        <button
        onClick={() => addToCart(product)}
        className="bg-black text-white p-2.5 rounded-full hover:bg-blue-600 transition-colors active:scale-90 shadow-lg shadow-blue-900/10"
        aria-label="Add to cart"
        >
        <Plus className="w-5 h-5" />
        </button>
    </div>
    </div>
</div>
);
};

export default function App() {
const gsapReady = useGsap();
const [products, setProducts] = useState(ALL_PRODUCTS);
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
    result = result.filter(
    (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
}
return result;
}, [selectedCategory, searchQuery, products]);

useEffect(() => {
if (gsapReady && heroRef.current) {
    const tl = window.gsap.timeline();
    tl.fromTo(
    heroRef.current.querySelector("h1"),
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    )
    .fromTo(
        heroRef.current.querySelector("p"),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.6"
    )
    .fromTo(
        heroRef.current.querySelector(".hero-btn"),
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
        "-=0.4"
    );
}
}, [gsapReady]);

useEffect(() => {
if (gsapReady && gridRef.current) {
    window.gsap.fromTo(
    gridRef.current.children,
    { y: 30, opacity: 0 },
    {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out",
        clearProps: "all",
    }
    );
}
}, [filteredProducts.length, selectedCategory, gsapReady, visibleCount]);

const addToCart = (product) => {
setCart((prev) => {
    const existing = prev.find((item) => item.id === product.id);
    if (existing)
    return prev.map((item) =>
        item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    return [...prev, { ...product, quantity: 1 }];
});

const btn = document.getElementById("cart-btn");
if (gsapReady && btn) {
    window.gsap.fromTo(
    btn,
    { scale: 1 },
    { scale: 1.2, duration: 0.15, yoyo: true, repeat: 1 }
    );
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

const removeItem = (id) =>
setCart((prev) => prev.filter((item) => item.id !== id));
const loadMore = () =>
setVisibleCount((prev) => Math.min(prev + 12, filteredProducts.length));

return (
<div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
    {/* Navigation */}
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
        <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setSelectedCategory("all")}
        >
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
            G
            </div>
            <span className="text-xl font-bold tracking-tight">
            DRAZEN Store
            </span>
        </div>

        <div className="hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-full w-96 focus-within:ring-2 focus-within:ring-blue-500/20 transition-shadow">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent border-none outline-none w-full text-sm placeholder-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>

        <div className="flex items-center gap-4">
            <button
            id="cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
            )}
            </button>
        </div>
        </div>
    </div>
    </nav>

    {/* Hero Section with Background Image */}
    <div className="relative bg-black border-b border-gray-800 overflow-hidden">
    {/* Background Overlay Image */}
    <div className="absolute inset-0 z-0 opacity-40">
        <img
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920"
        alt="Hero background"
        className="w-full h-full object-cover"
        />
    </div>

    <div
        className="relative z-10 max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center"
        ref={heroRef}
    >
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-xl">
        Curated Goods for the <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Modern Lifestyle
        </span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-200 mb-10 drop-shadow-md">
        Explore our collection of 100+ premium items across electronics,
        fashion, and home living.
        </p>

        <div className="hero-btn">
        <div className="flex flex-wrap justify-center gap-3">
            <button
            onClick={() => setSelectedCategory("all")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg ${
                selectedCategory === "all"
                ? "bg-white text-black scale-105"
                : "bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"
            }`}
            >
            All Items
            </button>
            {CATEGORIES.map((cat) => (
            <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg ${
                selectedCategory === cat.id
                    ? "bg-white text-black scale-105"
                    : "bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"
                }`}
            >
                <span>{cat.icon}</span> {cat.name}
            </button>
            ))}
        </div>
        </div>
    </div>
    </div>

    {/* Main Content */}
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {/* Results Header */}
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
        {selectedCategory === "all"
            ? "All Products"
            : CATEGORIES.find((c) => c.id === selectedCategory)?.name}
        <span className="ml-3 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {filteredProducts.length} items
        </span>
        </h2>
    </div>

    {/* Product Grid */}
    {filteredProducts.length > 0 ? (
        <>
        <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
            {filteredProducts.slice(0, visibleCount).map((product) => (
            <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                gsapReady={gsapReady}
            />
            ))}
        </div>

        {/* Load More */}
        {visibleCount < filteredProducts.length && (
            <div className="mt-16 text-center">
            <button
                onClick={loadMore}
                className="px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all shadow-lg active:scale-95"
            >
                Load More Products
            </button>
            </div>
        )}
        </>
    ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
        <div className="inline-block p-6 rounded-full bg-gray-50 mb-4">
            <Search className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
            No products found
        </h3>
        <p className="text-gray-500">
            Try adjusting your search or filter to find what you're looking
            for.
        </p>
        </div>
    )}
    </main>

    {/* Footer */}
    <footer className="bg-white border-t border-gray-200 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg">
                G
            </div>
            <span className="text-xl font-bold">DRAZEN Store</span>
            </div>
            <p className="text-gray-500 max-w-sm leading-relaxed">
            Experience the future of shopping with our curated collection.
            Quality meets modern design in every product we offer.
            </p>
        </div>
        <div>
            <h4 className="font-bold text-gray-900 mb-6">Shop Categories</h4>
            <ul className="space-y-3 text-gray-600 text-sm">
            {CATEGORIES.map((c) => (
                <li key={c.id}>
                <button
                    onClick={() => {
                    setSelectedCategory(c.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-blue-600 transition-colors"
                >
                    {c.name}
                </button>
                </li>
            ))}
            </ul>
        </div>
        <div>
            <h4 className="font-bold text-gray-900 mb-6">Support</h4>
            <ul className="space-y-3 text-gray-600 text-sm">
            <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                Contact Us
                </a>
            </li>
            <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                Shipping Information
                </a>
            </li>
            <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                Returns & Exchanges
                </a>
            </li>
            <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                Privacy Policy
                </a>
            </li>
            </ul>
        </div>
        </div>
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>&copy; 2024 DRAZEN Store Demo. All rights reserved.</p>
        <div className="mt-4 md:mt-0 flex gap-6">
            <a href="#" className="hover:text-black">
            Terms
            </a>
            <a href="#" className="hover:text-black">
            Privacy
            </a>
            <a href="#" className="hover:text-black">
            Cookies
            </a>
        </div>
        </div>
    </div>
    </footer>

    <CartDrawer
    isOpen={isCartOpen}
    onClose={() => setIsCartOpen(false)}
    cart={cart}
    updateQuantity={updateQuantity}
    removeItem={removeItem}
    gsapReady={gsapReady}
    />
</div>
);
}
