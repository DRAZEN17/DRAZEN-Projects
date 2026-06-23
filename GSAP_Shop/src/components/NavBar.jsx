import { Search, ShoppingBag } from "lucide-react";

export default function NavBar({
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  cart,
  setIsCartOpen,
}) {
  const itemCount = cart.reduce((a, b) => a + b.quantity, 0);

  return (
    <nav className="sticky top-0 z-40 bg-paper/95 backdrop-blur-md border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 gap-4">
          <button
            type="button"
            className="flex items-center gap-3 shrink-0"
            onClick={() => setSelectedCategory("all")}
          >
            <span className="w-9 h-9 rounded-full border border-ink flex items-center justify-center font-mono text-xs font-semibold">
              N9
            </span>
            <span className="font-display text-xl tracking-tight hidden sm:inline">
              Index <span className="text-stamp">No. 9</span>
            </span>
          </button>

          <div className="hidden md:flex items-center border-b border-ink/30 px-1 py-2 flex-1 max-w-md focus-within:border-stamp transition-colors">
            <Search className="w-4 h-4 text-meta mr-3 shrink-0" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search the catalog…"
              className="bg-transparent border-none outline-none w-full text-sm placeholder-meta font-sans"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            id="cart-btn"
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
            className="relative p-2 hover:bg-paper-dim rounded-full transition-colors shrink-0"
          >
            <ShoppingBag className="w-5 h-5 text-ink" aria-hidden="true" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-stamp text-paper text-[11px] font-mono font-semibold rounded-full flex items-center justify-center border-2 border-paper">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        <div className="md:hidden pb-3 -mt-1">
          <div className="flex items-center border-b border-ink/30 px-1 py-2 focus-within:border-stamp transition-colors">
            <Search className="w-4 h-4 text-meta mr-3 shrink-0" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search the catalog…"
              className="bg-transparent border-none outline-none w-full text-sm placeholder-meta font-sans"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
