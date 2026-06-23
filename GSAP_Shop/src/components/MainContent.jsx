import ProductCard from "./ProductCard";
import { SearchX } from "lucide-react";

export default function MainContent({
  filteredProducts,
  visibleCount,
  gridRef,
  addToCart,
  loadMore,
  selectedCategory,
  CATEGORIES,
}) {
  const activeDept = CATEGORIES.find((c) => c.id === selectedCategory);
  const sectionLabel = selectedCategory === "all" ? "Full index" : activeDept?.name;
  const sectionNumber = selectedCategory === "all" ? "00" : activeDept?.dept;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-baseline justify-between border-b border-line pb-4 mb-10">
        <h2 className="font-display text-2xl md:text-3xl flex items-baseline gap-3">
          <span className="font-mono text-sm text-stamp">{sectionNumber}</span>
          {sectionLabel}
        </h2>
        <span className="font-mono text-xs text-meta uppercase tracking-widest">
          {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
        </span>
      </div>

      {filteredProducts.length > 0 ? (
        <>
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
          >
            {filteredProducts.slice(0, visibleCount).map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} CATEGORIES={CATEGORIES} />
            ))}
          </div>

          {visibleCount < filteredProducts.length && (
            <div className="mt-16 text-center">
              <button
                type="button"
                onClick={loadMore}
                className="px-8 py-3 border border-ink text-ink font-mono text-sm uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors"
              >
                Show {Math.min(12, filteredProducts.length - visibleCount)} more
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-24 border border-dashed border-line">
          <div className="inline-flex p-5 rounded-full bg-paper-dim mb-5">
            <SearchX className="w-8 h-8 text-meta" aria-hidden="true" />
          </div>
          <h3 className="font-display text-xl mb-2">Nothing logged under that search.</h3>
          <p className="text-meta text-sm">Try a different word, or clear the filter to see the full index.</p>
        </div>
      )}
    </main>
  );
}
