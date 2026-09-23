import React from 'react'
import { MapPin, User, Info, Trash2 } from 'lucide-react'

export default function HouseCard({ house, onInspect, onDelete, user }) {
  const isOwner = user && house.ownerId === user.id;
  return (
    <div className="group relative bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden hover:border-purple-500/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)]">
      <div className="aspect-[4/3] relative overflow-hidden cursor-pointer" onClick={() => onInspect(house)}>
        <img src={house.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={house.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/60 backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[7px] md:text-[8px] font-black tracking-widest uppercase border border-white/10">
          {house.category}
        </div>
        {isOwner && (
          <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-blue-500/80 backdrop-blur-sm text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
            <User size={8} /> Your Asset
          </div>
        )}
        <div className="absolute bottom-3 left-4 right-4 md:bottom-4 md:left-6 md:right-6">
           <h3 className="text-base md:text-lg font-black italic tracking-tighter uppercase leading-none mb-1 line-clamp-1">{house.name}</h3>
           <div className="flex items-center gap-2 text-zinc-400 text-[8px] md:text-[9px] font-bold uppercase tracking-widest">
             <MapPin size={9} className="text-purple-500" /> {house.location}
           </div>
        </div>
      </div>
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div className="text-base md:text-lg font-black text-white/90 tracking-tighter">${house.price.toLocaleString()}</div>
          <div className="flex gap-2">
            <button onClick={() => onInspect(house)} className="bg-white/5 hover:bg-white/10 p-2 rounded-lg md:p-2.5 md:rounded-xl border border-white/5 transition-all">
              <Info size={14} />
            </button>
            {isOwner && (
              <button onClick={() => onDelete(house.id)} className="bg-red-500/10 text-red-500 p-2 rounded-lg md:p-2.5 md:rounded-xl hover:bg-red-500 hover:text-white transition-all">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
        <button 
          onClick={() => onInspect(house)}
          className="w-full bg-white text-black text-[9px] md:text-[10px] font-black uppercase tracking-widest py-2.5 md:py-3 rounded-lg md:rounded-xl hover:bg-purple-500 hover:text-white transition-all transform active:scale-95"
        >
          Inspect Details
        </button>
      </div>
    </div>
  )
}
