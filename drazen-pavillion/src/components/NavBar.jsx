import React from 'react'
import { User, LogOut, Menu, X, Home } from 'lucide-react'

export default function NavBar({ user, triggerPortal, warpIntoAuth, currentPage, setUser, mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-10 py-4 flex justify-between items-center h-16 md:h-20">
      <div onClick={() => triggerPortal('landing')} className="text-lg md:text-xl font-black tracking-tighter cursor-pointer flex items-center gap-3 group">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shrink-0">
          <Home size={16} className="md:w-5 md:h-5" />
        </div>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500 italic hidden sm:block">DRAZEN-Pavillion</span>
      </div>

      <div className="hidden lg:flex gap-8 items-center text-[10px] font-black uppercase tracking-widest">
        {user ? (
          <>
            <button onClick={() => triggerPortal('market')} className={`hover:text-purple-400 transition-colors ${currentPage === 'market' ? 'text-purple-400' : ''}`}>Market</button>
            <button onClick={() => triggerPortal('sell')} className={`hover:text-purple-400 transition-colors ${currentPage === 'sell' ? 'text-purple-400' : ''}`}>List Asset</button>
            <button onClick={() => triggerPortal('profile')} className={`flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/40 hover:bg-purple-500/20 transition-all ${currentPage === 'profile' ? 'bg-purple-500/20 border-purple-500' : ''}`}>
              <User size={12} /> {user.username}
            </button>
            <button onClick={() => { setUser(null); triggerPortal('landing'); }} className="text-red-500 hover:text-red-400"><LogOut size={16} /></button>
          </>
        ) : (
          <button onClick={warpIntoAuth} className="bg-white text-black px-6 py-2 rounded-full hover:bg-purple-500 hover:text-white transition-all font-bold">
            Access Marketplace
          </button>
        )}
      </div>

      <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl text-white">
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </nav>
  )
}
