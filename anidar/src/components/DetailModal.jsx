import React, { useEffect, useState } from 'react'
import { X, ExternalLink, Bookmark, Loader2 } from 'lucide-react'
import { fetchById } from './api.jsx'

export default function DetailModal({ selectedItem, setSelectedItem, handleExternalLink, toggleSave, savedIds, view }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedItem) {
      setDetail(null)
      return
    }

    let mounted = true
    setLoading(true)

    // Jikan only has /anime/{id} and /manga/{id} endpoints — "manhwa" is a
    // subtype of manga, so it must be requested via the manga endpoint.
    const category = view === 'anime' ? 'anime' : 'manga'

    fetchById(category, selectedItem.mal_id)
      .then((d) => {
        if (mounted) setDetail(d)
      })
      .catch((err) => {
        console.error('Detail fetch error', err)
      })
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [selectedItem])

  if (!selectedItem) return null

  const item = detail || selectedItem

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
      <div className="relative bg-[#111114] border border-white/10 max-w-5xl w-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row h-full max-h-[85vh] md:max-h-[90vh]">
        <div className="w-full md:w-2/5 h-48 md:h-auto shrink-0 relative">
          <img src={item.images?.webp?.large_image_url} className="w-full h-full object-cover" alt="" />
          <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-red-600 px-3 md:px-4 py-1 rounded-full text-[8px] md:text-[10px] font-black italic uppercase tracking-[0.2em]">Verified Hub</div>
        </div>

        <div className="p-6 md:p-12 overflow-y-auto w-full flex-1">
          <div className="flex justify-between items-start mb-4 md:mb-6">
            <div>
              <span className="text-red-500 font-black text-[9px] md:text-[10px] uppercase tracking-widest">{item.type}</span>
              <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter mt-1">{item.title_english || item.title}</h2>
            </div>
            <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-white/5 rounded-full transition">
              <X size={20} />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
                {item.genres?.map(g => (
                  <span key={g.mal_id} className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest px-2 md:px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-400">{g.name}</span>
                ))}
              </div>

              <p className="text-gray-400 leading-relaxed text-xs md:text-sm mb-6 md:mb-10 line-clamp-6 md:line-clamp-none">{item.synopsis || "No description provided for this entry."}</p>

              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-10">
                <div className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">Global Score</div>
                  <div className="text-xl md:text-2xl font-black text-red-500 italic">{item.score || 'N/A'}</div>
                </div>
                <div className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">Airing Status</div>
                  <div className="text-xl md:text-2xl font-black italic line-clamp-1">{item.status}</div>
                </div>
              </div>

              <div className="flex gap-3 md:gap-4 mt-auto">
                <button onClick={() => handleExternalLink(item.url)} className="flex-1 bg-red-600 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-red-700 transition flex items-center justify-center space-x-2">
                  <ExternalLink size={14} />
                  <span>Full Details</span>
                </button>
                <button onClick={() => toggleSave(item.mal_id)} className={`p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/10 hover:bg-white/10 transition ${savedIds.has(item.mal_id) ? 'bg-red-600/20 border-red-500/50' : ''}`}>
                  <Bookmark size={18} className={savedIds.has(item.mal_id) ? "fill-red-500 text-red-500" : ""} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}


