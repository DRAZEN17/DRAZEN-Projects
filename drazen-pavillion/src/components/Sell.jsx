import React from 'react'

export default function Sell({ addAsset }) {
  return (
    <div className="pt-32 md:pt-40 pb-20 px-6 max-w-xl mx-auto">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase mb-2">Register Asset</h1>
        <p className="text-zinc-500 text-[8px] md:text-[10px] font-black tracking-widest uppercase">Mint a new house to the global network</p>
      </div>
      <form onSubmit={addAsset} className="bg-zinc-900/60 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/10 space-y-4 md:space-y-6 shadow-2xl">
        <input name="name" required className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl p-4 text-[10px] md:text-[11px] font-black uppercase tracking-widest focus:border-purple-500 outline-none" placeholder="HOUSE NAME" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="price" type="number" required className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl p-4 text-[10px] md:text-[11px] font-black uppercase tracking-widest focus:border-purple-500 outline-none" placeholder="VALUATION ($)" />
          <select name="category" className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl p-4 text-[10px] md:text-[11px] font-black uppercase tracking-widest focus:border-purple-500 outline-none">
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
            <option value="Creative Studio">Creative Studio</option>
          </select>
        </div>
        <select name="location" className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl p-4 text-[10px] md:text-[11px] font-black uppercase tracking-widest focus:border-purple-500 outline-none">
            <option>Neo Tokyo</option>
            <option>Solari District</option>
            <option>Iron Citadel</option>
            <option>Lunar Heights</option>
            <option>Void Valley</option>
        </select>
        <textarea name="description" required className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl p-4 text-[10px] md:text-[11px] font-black uppercase tracking-widest h-24 md:h-32 focus:border-purple-500 outline-none" placeholder="DESCRIBE THE ASSET..."></textarea>
        <button className="w-full bg-white text-black py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all shadow-2xl text-xs md:text-sm">
          Register Listing
        </button>
      </form>
    </div>
  )
}
