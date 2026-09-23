import React from 'react'
import { ArrowLeft, CheckCircle2, MapPin, Trash2, CreditCard, Key } from 'lucide-react'

export default function SelectedHouseModal({ selectedHouse, setSelectedHouse, successMsg, isProcessing, handleTransaction, deleteAsset, user }) {
  if (!selectedHouse) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 md:p-10 animate-in fade-in zoom-in duration-300">
       <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setSelectedHouse(null)} />
       <div className="relative w-full max-w-5xl bg-zinc-900 border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
          <div className="md:w-1/2 relative h-48 md:h-auto shrink-0">
            <img src={selectedHouse.image} className="w-full h-full object-cover" alt={selectedHouse.name} />
            <button onClick={() => setSelectedHouse(null)} className="absolute top-4 left-4 md:top-6 md:left-6 w-10 h-10 md:w-12 md:h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
              <ArrowLeft size={18} />
            </button>
          </div>
          <div className="md:w-1/2 p-6 md:p-12 overflow-y-auto custom-scrollbar">
            {successMsg ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-500">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter mb-4">{successMsg}</h3>
                <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Updating mainframe registry...</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 md:mb-8">
                  <div>
                    <div className="text-purple-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-1 md:mb-2">{selectedHouse.category}</div>
                    <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase leading-none">{selectedHouse.name}</h2>
                  </div>
                  <div className="md:text-right">
                    <div className="text-xl md:text-2xl font-black tracking-tighter text-white/90 leading-none">${selectedHouse.price.toLocaleString()}</div>
                    <div className="text-[8px] md:text-[10px] font-bold text-zinc-500 uppercase">Total Buyout</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-[9px] md:text-[11px] font-bold uppercase tracking-widest mb-6 md:mb-8">
                  <MapPin size={12} className="text-purple-500" /> {selectedHouse.location}
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-10">
                  <div className="bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5">
                    <div className="text-zinc-500 text-[8px] md:text-[9px] font-black uppercase mb-1">Grid Speed</div>
                    <div className="text-xs md:text-sm font-bold">{selectedHouse.specs.networkSpeed}</div>
                  </div>
                  <div className="bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5">
                    <div className="text-zinc-500 text-[8px] md:text-[9px] font-black uppercase mb-1">Eco-Rating</div>
                    <div className="text-xs md:text-sm font-bold">{selectedHouse.specs.energy}</div>
                  </div>
                </div>
                <div className="mb-6 md:mb-10">
                  <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 md:mb-4">Description</h4>
                  <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">{selectedHouse.description}</p>
                </div>
                <div className="bg-black/40 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5 mb-6 md:mb-8">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[8px] md:text-[10px] font-black uppercase text-zinc-500">Monthly Lease</span>
                        <span className="text-base md:text-lg font-black text-white">${selectedHouse.rentPrice?.toLocaleString() || '4,500'}/mo</span>
                    </div>
                    <p className="text-[8px] md:text-[9px] text-zinc-600 uppercase font-black leading-tight">All rentals include high-speed grid access.</p>
                </div>
                <div className="flex flex-col gap-3">
                  {(!user || selectedHouse.ownerId !== user.id) ? (
                    <>
                      <button 
                        disabled={isProcessing}
                        onClick={() => handleTransaction(selectedHouse.id, 'buy')}
                        className="w-full bg-white text-black py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-xs md:text-sm"
                      >
                        {isProcessing ? 'Verifying...' : <><CreditCard size={16}/> Purchase Estate</>}
                      </button>
                      <button 
                        disabled={isProcessing}
                        onClick={() => handleTransaction(selectedHouse.id, 'rent')}
                        className="w-full bg-zinc-800 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-xs md:text-sm"
                      >
                        {isProcessing ? 'Verifying...' : <><Key size={16}/> Start Rental</>}
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3">
                        <div className="bg-green-500/10 border border-green-500/20 p-3 md:p-4 rounded-xl md:rounded-2xl text-center">
                            <span className="text-green-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest">You own this asset</span>
                        </div>
                        <button 
                            onClick={() => deleteAsset(selectedHouse.id)}
                            className="w-full bg-red-500 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2 text-xs md:text-sm"
                        >
                            <Trash2 size={16} /> Liquidate Asset
                        </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
       </div>
    </div>
  )
}
