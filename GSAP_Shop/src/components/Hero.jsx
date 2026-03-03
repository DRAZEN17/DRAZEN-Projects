import React from "react";

export default function Hero({ heroRef, setSelectedCategory, selectedCategory, CATEGORIES }) {
  return (
    <div className="relative bg-black border-b border-gray-800 overflow-hidden">
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
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
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
  );
}
