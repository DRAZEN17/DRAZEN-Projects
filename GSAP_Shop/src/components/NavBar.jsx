import React from "react";
import { ShoppingCart, Search } from "lucide-react";

export default function NavBar({
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  cart,
  setIsCartOpen,
}) {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setSelectedCategory("all")}
          >
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
              A&A
            </div>
            <span className="text-xl font-bold tracking-tight">ALL & ALL Store</span>
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
  );
}
