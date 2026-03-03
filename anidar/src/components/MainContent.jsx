import React from 'react'
import { Bookmark } from 'lucide-react'

export default function MainContent({ loading, items, setSelectedItem, savedIds }) {
  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <div className="flex items-center space-x-4 mb-8 md:mb-10">
        <h2 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter">Top Picks</h2>
        <div className="h-[2px] flex-1 bg-gradient-to-r from-red-600 to-transparent opacity-20" />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 text-gray-500">
          <div className="animate-spin mb-4" style={{width:40,height:40,borderRadius:20,background:'rgba(255,255,255,0.08)'}} />
          <p className="uppercase tracking-widest text-[10px] font-bold">Synchronizing Database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {items.map((item) => (
            <div
              key={item.mal_id}
              onClick={() => setSelectedItem(item)}
              className="group relative bg-white/5 border border-white/5 rounded-xl md:rounded-2xl overflow-hidden cursor-pointer hover:border-red-500/50 transition-all active:scale-95 md:hover:-translate-y-2"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img src={item.images.webp.large_image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-110" loading="lazy" />
                <div className="absolute top-2 right-2 bg-black/80 px-1.5 md:px-2 py-1 rounded text-[9px] md:text-[10px] font-black text-red-500 italic">{item.score || 'N/A'}</div>
              </div>
              <div className="p-2 md:p-3">
                <h3 className="font-bold text-xs md:text-sm truncate">{item.title_english || item.title}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-tighter">{item.type}</span>
                  {savedIds.has(item.mal_id) && <Bookmark size={10} className="fill-red-500 text-red-500" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
