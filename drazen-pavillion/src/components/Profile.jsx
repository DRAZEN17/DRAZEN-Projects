import React from 'react'
import HouseCard from './HouseCard'

export default function Profile({ user, houses, deleteAsset }) {
  const myHouses = houses.filter(h => h.ownerId === user.id)
  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10 mb-12 md:mb-20 p-8 md:p-12 bg-zinc-900/40 border border-white/10 rounded-[2rem] md:rounded-[4rem] shadow-2xl">
         <div className="w-24 h-24 md:w-40 md:h-40 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-3xl md:rounded-[2.5rem] flex items-center justify-center text-4xl md:text-6xl font-black italic shadow-2xl shrink-0">
           {user.username[0]}
         </div>
         <div className="text-center md:text-left">
           <div className="inline-block px-2.5 py-0.5 md:px-3 md:py-1 bg-purple-500/20 rounded-full text-[8px] md:text-[9px] font-black tracking-widest uppercase text-purple-400 mb-3 md:mb-4 border border-purple-500/30">Authenticated User</div>
           <h1 className="text-3xl md:text-6xl font-black italic tracking-tighter uppercase mb-1 md:mb-2 leading-none">{user.username}</h1>
           <div className="text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-widest">{user.email}</div>
         </div>
      </div>
      
      <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter mb-8 md:mb-12 border-b border-white/5 pb-4 md:pb-6">Your Secured Portfolio</h2>
      {myHouses.length === 0 ? (
        <div className="py-20 text-center bg-white/5 rounded-[2rem] md:rounded-[3rem] border border-dashed border-white/10">
           <p className="text-zinc-600 font-black uppercase tracking-widest text-[8px] md:text-[10px]">No assets found in your portfolio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {myHouses.map(h => <HouseCard key={h.id} house={h} onDelete={deleteAsset} onInspect={() => {}} user={user} />)}
        </div>
      )}
    </div>
  )
}
