import React from 'react'

export default function AuthModal({ showAuthModal, setShowAuthModal, handleAuth }) {
  if (!showAuthModal) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowAuthModal(false)} />
      <div className="relative bg-[#111114] border border-white/10 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] w-full max-w-sm text-center shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-black italic uppercase mb-2">Zenith Access</h2>
        <p className="text-gray-400 text-xs md:text-sm mb-6 md:mb-8">Unlock bookmarks and detailed insights.</p>
        <form onSubmit={handleAuth} className="space-y-4">
          <input name="email" type="email" required placeholder="Enter your email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 md:px-5 py-3 md:py-4 focus:border-red-600 outline-none transition text-sm" />
          <button className="w-full bg-red-600 py-3 md:py-4 rounded-xl font-black uppercase tracking-widest text-xs md:text-sm hover:bg-red-700 transition shadow-lg shadow-red-600/20">Continue</button>
        </form>
      </div>
    </div>
  )
}
