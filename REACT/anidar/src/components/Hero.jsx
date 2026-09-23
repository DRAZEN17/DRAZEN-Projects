import React from 'react'
import { Search } from 'lucide-react'

const categories = [
  { key: 'anime', label: 'Anime' },
  { key: 'manga', label: 'Manga' },
  { key: 'manhwa', label: 'Manhwa' },
]

export default function Hero({ view, setView, searchQuery, setSearchQuery, handleSearch, loadItems }) {
  const handleViewClick = async (nextView) => {
    if (nextView === view) return
    setView(nextView)
    if (loadItems) {
      await loadItems(nextView, searchQuery)
    }
  }

  return (
    <header className="relative h-[52vh] md:h-[64vh] flex items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=2000"
          className="w-full h-full object-cover opacity-20 scale-105"
          alt="Hero Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent" />
      </div>

      <div className="relative z-10 text-center w-full max-w-4xl mt-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[10px] md:text-[11px] font-black uppercase tracking-[0.28em] text-red-300">
          Trending worldwide
        </div>

        <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter mb-4 leading-none">
          Your <br /> <span className="text-red-600">Anime Radar</span>
        </h1>

        <div className="mb-7 flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {categories.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleViewClick(item.key)}
              className={`rounded-full border px-3 py-1.5 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition ${
                view === item.key
                  ? 'border-red-500 bg-red-600 text-white shadow-lg shadow-red-600/20'
                  : 'border-white/10 bg-white/5 text-gray-300 hover:border-red-500/50 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="relative mt-4 group mx-auto max-w-xl md:max-w-2xl">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${view}...`}
            className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-5 md:px-6 py-3 md:py-4 outline-none focus:border-red-600 transition-all text-base md:text-lg shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
          />
          <button type="submit" className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-red-600 p-2.5 rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-600/20">
            <Search size={18} />
          </button>
        </form>
      </div>
    </header>
  )
}
