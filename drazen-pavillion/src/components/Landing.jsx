import React from 'react'
import { ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function Landing({ showAuthForm, warpIntoAuth, isLoginView, setIsLoginView, triggerPortal, authError, authSuccess, handleAuth, authForm, setAuthForm }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-12 md:pt-28 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-[300px] h-[300px] md:w-[800px] md:h-[800px] bg-purple-600/20 rounded-full blur-[80px] md:blur-[150px] animate-pulse" />
      </div>
      {!showAuthForm ? (
        <div className="relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] md:text-[9px] font-black tracking-[0.4em] uppercase mb-8 md:mb-12">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Asset Liquidity Network
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-[140px] font-black leading-[0.9] tracking-tighter italic mb-8">
            DRAZEN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-400 to-orange-400">PAVILLION.</span>
          </h1>
          <p className="text-zinc-500 text-sm md:text-2xl mb-12 md:mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
            Browse, buy, or rent the most exclusive high-tech luxury houses across the Neo-Grid.
          </p>
          <button onClick={warpIntoAuth} className="group relative bg-white text-black px-8 py-5 md:px-12 md:py-6 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] overflow-hidden hover:bg-purple-600 hover:text-white transition-all shadow-2xl text-xs md:text-sm">
            <span className="relative z-10">Enter Marketplace</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </button>
        </div>
      ) : (
        <div className="max-w-md w-full relative z-10 bg-zinc-900/60 backdrop-blur-3xl border border-white/10 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] animate-in slide-in-from-bottom-12 duration-500 shadow-3xl mx-auto">
           <div className="text-center mb-8 md:mb-10">
             <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-600/20 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
               <ShieldCheck size={32} className="text-purple-500" />
             </div>
             <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">Secure Link</h2>
           </div>
           <div className="flex gap-1 mb-6 md:mb-8 bg-black/40 p-1 rounded-xl md:rounded-2xl border border-white/5">
             {['Login', 'Register'].map(tab => (
               <button key={tab} onClick={() => setIsLoginView(tab === 'Login')}
                className={`flex-1 py-2.5 md:py-3 text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-lg md:rounded-xl transition-all ${((tab === 'Login' && isLoginView) || (tab === 'Register' && !isLoginView)) ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-300'}`}>
                 {tab}
               </button>
             ))}
           </div>
           {authError && <div className="mb-4 text-red-500 text-[9px] font-bold text-center bg-red-500/10 p-3 rounded-xl border border-red-500/20 uppercase flex items-center gap-2"><AlertCircle size={14}/> {authError}</div>}
           {authSuccess && <div className="mb-4 text-green-500 text-[9px] font-bold text-center bg-green-500/10 p-3 rounded-xl border border-green-500/20 uppercase flex items-center gap-2"><CheckCircle2 size={14}/> {authSuccess}</div>}
           <form onSubmit={handleAuth} className="space-y-3 md:space-y-4">
             {!isLoginView && (
               <input placeholder="USERNAME" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 md:px-5 md:py-4 focus:border-purple-500 outline-none text-[10px] font-black uppercase tracking-widest"
                onChange={e => setAuthForm({...authForm, username: e.target.value})} />
             )}
             <input type="email" placeholder="ID@DRAZEN.GLOBAL" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 md:px-5 md:py-4 focus:border-purple-500 outline-none text-[10px] font-black uppercase tracking-widest"
              onChange={e => setAuthForm({...authForm, email: e.target.value})} />
             <input type="password" placeholder="SECURITY PASSCODE" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 md:px-5 md:py-4 focus:border-purple-500 outline-none text-[10px] font-black uppercase tracking-widest"
              onChange={e => setAuthForm({...authForm, password: e.target.value})} />
             <button className="w-full bg-white text-black py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all mt-4 shadow-xl text-xs md:text-sm">
               {isLoginView ? 'Authenticate' : 'Register Signature'}
             </button>
           </form>
           <button onClick={() => triggerPortal('landing')} className="w-full mt-6 md:mt-8 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-400">Abort Access</button>
        </div>
      )}
    </div>
  )
}
