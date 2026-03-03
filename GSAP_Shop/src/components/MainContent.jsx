import React from "react";
import ProductCard from "./ProductCard";
import { Search } from "lucide-react";

export default function MainContent({
  filteredProducts,
  visibleCount,
  gridRef,
  addToCart,
  gsapReady,
  loadMore,
  selectedCategory,
  CATEGORIES,
}) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {selectedCategory === "all" ? "All Products" : CATEGORIES.find((c) => c.id === selectedCategory)?.name}
          <span className="ml-3 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {filteredProducts.length} items
          </span>
        </h2>
      </div>

      {filteredProducts.length > 0 ? (
        <>
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.slice(0, visibleCount).map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} gsapReady={gsapReady} CATEGORIES={CATEGORIES} />
            ))}
          </div>

          {visibleCount < filteredProducts.length && (
            <div className="mt-16 text-center">
              <button onClick={loadMore} className="px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all shadow-lg active:scale-95">
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      )}
    </main>
  );
}
