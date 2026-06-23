export default function Hero({ heroRef, setSelectedCategory, selectedCategory, CATEGORIES, totalCount }) {
  return (
    <div className="relative bg-ink text-paper overflow-hidden">
      {/* Faint index lines — the "ledger" texture, not decoration for its own sake */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent 39px, currentColor 39px, currentColor 40px)",
        }}
        aria-hidden="true"
      />

      <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="flex items-baseline justify-between border-b border-paper/20 pb-6 mb-10">
          <span className="font-mono text-xs tracking-widest text-paper/50 uppercase">Est. catalog</span>
          <span className="font-mono text-xs tracking-widest text-paper/50 uppercase">{totalCount} items indexed</span>
        </div>

        <h1 className="hero-title font-display text-5xl sm:text-6xl md:text-8xl leading-[0.95] tracking-tight mb-6">
          A catalog of
          <br />
          <span className="text-stamp">everything</span>, numbered.
        </h1>

        <p className="hero-sub max-w-xl text-lg text-paper/70 mb-12 leading-relaxed">
          Five departments. One hundred goods. Each one logged, priced, and
          ready to ship — no algorithm deciding what you see first.
        </p>

        <nav aria-label="Departments" className="hero-depts">
          <ol className="flex flex-wrap gap-x-8 gap-y-4">
            <li>
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`group flex items-baseline gap-2 font-mono text-sm transition-colors ${
                  selectedCategory === "all" ? "text-stamp" : "text-paper/60 hover:text-paper"
                }`}
              >
                <span className="text-xs">00</span>
                <span className="border-b border-transparent group-hover:border-current pb-0.5">
                  Everything
                </span>
              </button>
            </li>
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`group flex items-baseline gap-2 font-mono text-sm transition-colors ${
                    selectedCategory === cat.id ? "text-stamp" : "text-paper/60 hover:text-paper"
                  }`}
                >
                  <span className="text-xs">{cat.dept}</span>
                  <span className="border-b border-transparent group-hover:border-current pb-0.5">
                    {cat.name}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
