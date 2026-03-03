import React, { useRef, useState } from "react";
import { Star, Plus, Loader2 } from "lucide-react";

export default function ProductCard({ product, addToCart, gsapReady, CATEGORIES }) {
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
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {product.rating}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">
          {CATEGORIES.find((c) => c.id === product.category)?.name}
        </div>
        <h3 className="font-bold text-gray-800 text-lg mb-2 leading-tight group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-gray-900">${product.price}</span>
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
}
