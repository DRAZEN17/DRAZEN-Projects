export default function Footer({ setSelectedCategory, CATEGORIES }) {
  const goTo = (id) => {
    setSelectedCategory(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-ink text-paper mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-9 h-9 rounded-full border border-paper flex items-center justify-center font-mono text-xs font-semibold">
                N9
              </span>
              <span className="font-display text-xl">
                Index <span className="text-stamp">No. 9</span>
              </span>
            </div>
            <p className="text-paper/60 max-w-sm leading-relaxed text-sm">
              Five departments, logged and numbered. We built this catalog so
              you can browse by department instead of by algorithm.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-paper/50 mb-5">Departments</h4>
            <ul className="space-y-3 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => goTo(c.id)}
                    className="text-paper/70 hover:text-stamp transition-colors"
                  >
                    {c.dept} — {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-paper/50 mb-5">Support</h4>
            <ul className="space-y-3 text-sm text-paper/70">
              <li><a href="#" className="hover:text-stamp transition-colors">Contact us</a></li>
              <li><a href="#" className="hover:text-stamp transition-colors">Shipping information</a></li>
              <li><a href="#" className="hover:text-stamp transition-colors">Returns & exchanges</a></li>
              <li><a href="#" className="hover:text-stamp transition-colors">Privacy policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-paper/15 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-paper/40 font-mono">
          <p>© 2026 Index No. 9 — demo catalog.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-paper">Terms</a>
            <a href="#" className="hover:text-paper">Privacy</a>
            <a href="#" className="hover:text-paper">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
