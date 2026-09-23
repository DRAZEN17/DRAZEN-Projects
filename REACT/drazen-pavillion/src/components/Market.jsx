import React from 'react'
import HouseCard from './HouseCard'

export default function Market({ filteredHouses, searchQuery, setSearchQuery, activeCategory, setActiveCategory, CATEGORIES, SECTORS, onInspect, onDelete, user }) {
  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
        <aside className="lg:w-64 xl:w-72 space-y-8 md:space-y-10 shrink-0">
           <div>
             <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4 md:mb-6 flex items-center gap-2">Search Mainframe</h3>
             <div className="relative">
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3.5 md:py-4 px-5 md:px-6 text-[10px] font-bold outline-none focus:border-purple-500 transition-all" placeholder="HOUSE NAME..." />
             </div>
           </div>
           <div>
             <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4 md:mb-6">Property Types</h3>
             <div className="flex flex-wrap lg:flex-col gap-2">
               {['All', ...CATEGORIES].map(cat => (
                 <button key={cat} onClick={() => setActiveCategory(cat)} className={`text-left px-4 py-2.5 md:px-5 md:py-3 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-purple-600 text-white shadow-lg' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}>
                   {cat}
                 </button>
               ))}
             </div>
           </div>
        </aside>
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-12 border-b border-white/5 pb-6 md:pb-8 gap-4">
             <div>
                <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase mb-1">Market Liquidity</h1>
                <p className="text-zinc-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">{filteredHouses.length} Premium Estates Available</p>
             </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
            {filteredHouses.map(h => <HouseCard key={h.id} house={h} onInspect={onInspect} onDelete={onDelete} user={user} />)}
          </div>
          {filteredHouses.length === 0 && (
            <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
               <p className="text-zinc-600 font-black uppercase tracking-widest text-[9px]">Zero entities found on this grid.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
