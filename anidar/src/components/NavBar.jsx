import React from 'react'
import { User, X, Menu } from 'lucide-react'

export default function NavBar({ view, setView, setSearchQuery, setShowAuthModal, isLoggedIn, userEmail, isMobileMenuOpen, setIsMobileMenuOpen }) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-xl border-b border-white/5 px-4 md:px-6 py-4 flex justify-between items-center">
      <div
        className="text-xl md:text-2xl font-black tracking-tighter cursor-pointer"
        onClick={() => { setView('anime'); setSearchQuery(''); }}
      >
        ANIDAR<span className="text-red-500">.</span>
      </div>

      <div className="hidden md:flex space-x-8 text-[10px] font-black uppercase tracking-[0.2em]">
        {['anime', 'manga', 'manhwa'].map((t) => (
          <button
            key={t}
            onClick={() => setView(t)}
            className={`hover:text-red-500 transition-colors ${view === t ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowAuthModal(true)}
          className={`flex items-center space-x-2 px-4 md:px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all ${
            isLoggedIn ? 'bg-white/5 border border-white/10' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          <User size={14} />
          <span className="hidden sm:inline">{isLoggedIn ? userEmail.split('@')[0] : 'Account'}</span>
        </button>

        <button className="md:hidden p-2 text-gray-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </nav>
  )
}
