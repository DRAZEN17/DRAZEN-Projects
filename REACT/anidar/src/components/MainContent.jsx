import React from 'react'
import { Bookmark } from 'lucide-react'

export default function MainContent({ loading, items, setSelectedItem, savedIds, heading, error }) {
  const featuredItems = items.slice(0, 3);
  const isSearchView = heading && heading.toLowerCase().includes('results for');

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <div className="flex items-center space-x-4 mb-8 md:mb-10">
        <h2 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter">{heading || 'Top Picks'}</h2>
        <div className="h-[2px] flex-1 bg-gradient-to-r from-red-600 to-transparent opacity-20" />
      </div>

      {error && !loading && (
        <div className="mb-8 rounded-3xl border border-red-600/40 bg-red-600/10 px-6 py-5 text-red-100 text-sm md:text-base">
          {error}
        </div>
      )}

      {!loading && !error && items.length > 0 && !isSearchView && (
        <div className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-red-400">Featured this week</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {featuredItems.map((item) => (
              <div
                key={`featured-${item.mal_id}`}
                onClick={() => setSelectedItem(item)}
                className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/8 to-white/2 shadow-[0_12px_40px_rgba(0,0,0,0.28)] cursor-pointer transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_18px_50px_rgba(239,68,68,0.14)] md:hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={item.images.webp.large_image_url} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute top-3 right-3 rounded-full border border-red-500/30 bg-black/60 px-2 py-1 text-[9px] md:text-[10px] font-black text-red-300">{item.score || 'N/A'}</div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-red-400">{item.type}</span>
                    </div>
                    <h3 className="mt-2 text-lg md:text-xl font-black italic tracking-tighter text-white">{item.title_english || item.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 text-gray-500">
          <div className="animate-spin mb-4" style={{width:40,height:40,borderRadius:20,background:'rgba(255,255,255,0.08)'}} />
          <p className="uppercase tracking-widest text-[10px] font-bold">Synchronizing Database...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center text-gray-300">
          <p className="text-lg md:text-xl font-black italic uppercase tracking-tighter text-white">No matches found</p>
          <p className="mt-2 text-sm text-gray-400">Try a different title, keyword, or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {items.map((item) => (
            <div
              key={item.mal_id}
              onClick={() => setSelectedItem(item)}
              className="group relative overflow-hidden rounded-xl md:rounded-2xl border border-white/5 bg-white/5 shadow-[0_10px_24px_rgba(0,0,0,0.18)] cursor-pointer transition-all duration-300 active:scale-95 hover:border-red-500/50 hover:shadow-[0_16px_30px_rgba(239,68,68,0.12)] md:hover:-translate-y-2"
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
