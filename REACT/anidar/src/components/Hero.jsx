import React from 'react'
import { Search } from 'lucide-react'

export default function Hero({ view, searchQuery, setSearchQuery, handleSearch }) {
  return (
    <header className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=2000"
          className="w-full h-full object-cover opacity-20 scale-105"
          alt="Hero Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 text-center w-full max-w-2xl mt-12">
        <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter mb-4 leading-none">
          Your <br /> <span className="text-red-600">Anime Radar</span>
        </h1>
        <form onSubmit={handleSearch} className="relative mt-8 group mx-auto max-w-lg md:max-w-none">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${view}...`}
            className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-5 md:px-6 py-3 md:py-4 outline-none focus:border-red-600 transition-all text-base md:text-lg"
          />
          <button type="submit" className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-red-600 p-2 rounded-xl hover:bg-red-700 transition">
            <Search size={18} />
          </button>
        </form>
      </div>
    </header>
  )
}
