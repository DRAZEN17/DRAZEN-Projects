import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  PlusCircle, 
  User, 
  LogOut, 
  MapPin, 
  Trash2, 
  Menu, 
  X,
  Zap,
  ShieldCheck,
  Building,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Filter,
  Cpu,
  Database,
  Wind,
  Layers,
  Home,
  ArrowLeft,
  Info,
  CreditCard,
  Key
} from 'lucide-react';

// --- ENHANCED MARKET DATABASE ENGINE ---
const SECTORS = [
  { id: 'tokyo', name: "Neo Tokyo", color: "from-pink-500 to-purple-600" },
  { id: 'solari', name: "Solari District", color: "from-orange-400 to-red-500" },
  { id: 'citadel', name: "Iron Citadel", color: "from-zinc-500 to-blue-900" },
  { id: 'lunar', name: "Lunar Heights", color: "from-blue-200 to-cyan-400" },
  { id: 'void', name: "Void Valley", color: "from-purple-900 to-black" }
];

const CATEGORIES = ["Residential", "Commercial", "Industrial", "Creative Studio"];

const getEstateImage = (index) => {
  const mansionPool = [
    "modern-mansion-luxury",
  ];
  const selectedKeyword = mansionPool[index % 1];
  return `https://picsum.photos/seed/mansion-${index % 1}-${selectedKeyword}/1200/800`;
};

const generateEnhancedDatabase = (count) => {
  const houseNames = ["Sky Villa", "Zenith Manor", "Opal Estate", "Prism House", "Horizon Mansion"];
  return Array.from({ length: count }).map((_, i) => {
    const sector = SECTORS[i % SECTORS.length];
    const category = CATEGORIES[i % CATEGORIES.length];
    const baseName = houseNames[i % houseNames.length];
    return {
      id: i + 1,
      name: `${baseName} ${100 + i}`,
      price: Math.floor(Math.random() * 5000000) + 850000,
      rentPrice: Math.floor(Math.random() * 5000) + 2000,
      location: sector.name,
      sectorId: sector.id,
      category: category,
      description: "A breathtaking luxury home featuring floor-to-ceiling smart glass, eco-friendly climate control, and advanced safety systems. This property represents the pinnacle of modern architectural achievement.",
      specs: {
        networkSpeed: (Math.random() * 10).toFixed(1) + " Gbps",
        energy: Math.floor(Math.random() * 20) + 80 + "% Efficient",
        power: "Solar-Fusion",
        floors: Math.floor(Math.random() * 4) + 2
      },
      image: getEstateImage(i),
      ownerId: i < 3 ? 'demo-user' : 'network-prime',
      isBest: i % 8 === 0
    };
  });
};

const INITIAL_DB = generateEnhancedDatabase(60);

const App = () => {
  const [user, setUser] = useState(null); 
  const [registeredUsers, setRegisteredUsers] = useState([
    { email: 'demo@pavilion.com', password: 'password', username: 'Demo_Resident', id: 'demo-user' }
  ]);
  
  const [currentPage, setCurrentPage] = useState('landing'); 
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [houses, setHouses] = useState(INITIAL_DB);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSector, setActiveSector] = useState('All');
  
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [authForm, setAuthForm] = useState({ email: '', password: '', username: '' });
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isWarping, setIsWarping] = useState(false);
  
  const portalRef = useRef(null);

  const filteredHouses = useMemo(() => {
    return houses.filter(h => {
      const matchSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          h.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCategory === 'All' || h.category === activeCategory;
      const matchSector = activeSector === 'All' || h.sectorId === activeSector;
      return matchSearch && matchCat && matchSector;
    });
  }, [houses, searchQuery, activeCategory, activeSector]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const triggerPortal = (nextPage) => {
    if (isWarping) return;
    setMobileMenuOpen(false);
    setIsWarping(true);
    const gs = window.gsap;
    if (!gs) {
      setCurrentPage(nextPage);
      setIsWarping(false);
      return;
    }
    const tl = gs.timeline();
    portalRef.current.style.display = 'flex';
    tl.to(portalRef.current.querySelector('.portal-disk'), {
      scale: 100, opacity: 1, duration: 0.7, ease: "expo.inOut"
    })
    .call(() => {
      setCurrentPage(nextPage);
      setSelectedHouse(null);
      setSuccessMsg('');
      window.scrollTo(0, 0);
      if (nextPage !== 'landing') setShowAuthForm(false);
    })
    .to(portalRef.current.querySelector('.portal-disk'), {
      scale: 0, opacity: 0, duration: 0.7, ease: "expo.inOut",
      onComplete: () => {
        portalRef.current.style.display = 'none';
        setIsWarping(false);
      }
    });
  };

  const warpIntoAuth = () => {
    if (isWarping) return;
    setIsWarping(true);
    const gs = window.gsap;
    const tl = gs.timeline();
    portalRef.current.style.display = 'flex';
    tl.to(portalRef.current.querySelector('.portal-disk'), {
      scale: 100, opacity: 1, duration: 0.5, ease: "circ.in"
    })
    .call(() => {
      setShowAuthForm(true);
      setAuthError('');
      setAuthSuccess('');
    })
    .to(portalRef.current.querySelector('.portal-disk'), {
      scale: 0, opacity: 0, duration: 0.5, ease: "circ.out",
      onComplete: () => {
        portalRef.current.style.display = 'none';
        setIsWarping(false);
      }
    });
  };

  const handleAuth = (e) => {
    e.preventDefault();
    setAuthError('');
    if (isLoginView) {
      const found = registeredUsers.find(u => u.email === authForm.email && u.password === authForm.password);
      if (found) { setUser(found); triggerPortal('market'); }
      else { setAuthError('Access Denied: Credentials not found.'); }
    } else {
      if (registeredUsers.some(u => u.email === authForm.email)) {
        setAuthError('Error: This identity is already registered.');
      } else {
        const newUser = { ...authForm, id: 'user_' + Date.now() };
        setRegisteredUsers([...registeredUsers, newUser]);
        setAuthSuccess('Account Created! Returning to Login...');
        setTimeout(() => setIsLoginView(true), 1500);
      }
    }
  };

  const addAsset = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newAsset = {
      id: Date.now(),
      name: fd.get('name'),
      price: Number(fd.get('price')),
      rentPrice: Math.floor(Number(fd.get('price')) * 0.003),
      location: fd.get('location'),
      category: fd.get('category'),
      description: fd.get('description'),
      image: getEstateImage(houses.length),
      ownerId: user.id,
      specs: { networkSpeed: "10 Gbps", energy: "98% Efficient", power: "Clean Fusion", floors: 2 }
    };
    setHouses([newAsset, ...houses]);
    triggerPortal('profile');
  };

  const handleTransaction = (houseId, type) => {
    if (!user) {
      warpIntoAuth();
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setHouses(prev => prev.map(h => {
        if (h.id === houseId) {
          return { ...h, ownerId: user.id };
        }
        return h;
      }));
      setIsProcessing(false);
      setSuccessMsg(`${type === 'buy' ? 'Purchased' : 'Rented'} Successfully! Added to your portfolio.`);
      setTimeout(() => {
        triggerPortal('profile');
      }, 1500);
    }, 2000);
  };

  const deleteAsset = (id) => {
    setHouses(prev => prev.filter(h => h.id !== id));
    if (selectedHouse && selectedHouse.id === id) setSelectedHouse(null);
  };

  const HouseCard = ({ house }) => {
    const isOwner = user && house.ownerId === user.id;
    return (
      <div className="group relative bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden hover:border-purple-500/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)]">
        <div className="aspect-[4/3] relative overflow-hidden cursor-pointer" onClick={() => setSelectedHouse(house)}>
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
              <button onClick={() => setSelectedHouse(house)} className="bg-white/5 hover:bg-white/10 p-2 rounded-lg md:p-2.5 md:rounded-xl border border-white/5 transition-all">
                <Info size={14} />
              </button>
              {isOwner && (
                <button onClick={() => deleteAsset(house.id)} className="bg-red-500/10 text-red-500 p-2 rounded-lg md:p-2.5 md:rounded-xl hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
          <button 
            onClick={() => setSelectedHouse(house)}
            className="w-full bg-white text-black text-[9px] md:text-[10px] font-black uppercase tracking-widest py-2.5 md:py-3 rounded-lg md:rounded-xl hover:bg-purple-500 hover:text-white transition-all transform active:scale-95"
          >
            Inspect Details
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500 selection:text-white font-sans overflow-x-hidden">
      {/* --- PORTAL EFFECT --- */}
      <div ref={portalRef} className="fixed inset-0 z-[100] hidden items-center justify-center pointer-events-none">
        <div className="portal-disk w-10 h-10 bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 rounded-full blur-3xl opacity-0 scale-0 shadow-[0_0_200px_rgba(168,85,247,0.8)]" />
        <div className="absolute inset-0 bg-black opacity-0" />
      </div>

      {/* --- HOUSE DETAIL & PURCHASE MODAL --- */}
      {selectedHouse && (
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
      )}

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-10 py-4 flex justify-between items-center h-16 md:h-20">
        <div onClick={() => triggerPortal('landing')} className="text-lg md:text-xl font-black tracking-tighter cursor-pointer flex items-center gap-3 group">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shrink-0">
            <Home size={16} className="md:w-5 md:h-5" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500 italic hidden sm:block">DRAZEN</span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-8 items-center text-[10px] font-black uppercase tracking-widest">
          {user ? (
            <>
              <button onClick={() => triggerPortal('market')} className={`hover:text-purple-400 transition-colors ${currentPage === 'market' ? 'text-purple-400' : ''}`}>Market</button>
              <button onClick={() => triggerPortal('sell')} className={`hover:text-purple-400 transition-colors ${currentPage === 'sell' ? 'text-purple-400' : ''}`}>List Asset</button>
              <button onClick={() => triggerPortal('profile')} className={`flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/40 hover:bg-purple-500/20 transition-all ${currentPage === 'profile' ? 'bg-purple-500/20 border-purple-500' : ''}`}>
                <User size={12} /> {user.username}
              </button>
              <button onClick={() => { setUser(null); triggerPortal('landing'); }} className="text-red-500 hover:text-red-400"><LogOut size={16} /></button>
            </>
          ) : (
            <button onClick={warpIntoAuth} className="bg-white text-black px-6 py-2 rounded-full hover:bg-purple-500 hover:text-white transition-all font-bold">
              Access Marketplace
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl text-white">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-zinc-900 border-b border-white/5 p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300 lg:hidden shadow-2xl">
            {user ? (
              <>
                <button onClick={() => triggerPortal('market')} className="text-left py-4 border-b border-white/5 text-[10px] font-black uppercase tracking-widest">Marketplace</button>
                <button onClick={() => triggerPortal('sell')} className="text-left py-4 border-b border-white/5 text-[10px] font-black uppercase tracking-widest">List New Asset</button>
                <button onClick={() => triggerPortal('profile')} className="text-left py-4 border-b border-white/5 text-[10px] font-black uppercase tracking-widest flex items-center justify-between">
                  Your Profile <User size={14} className="text-purple-500" />
                </button>
                <button onClick={() => { setUser(null); triggerPortal('landing'); }} className="text-left py-4 text-red-500 text-[10px] font-black uppercase tracking-widest">Sign Out</button>
              </>
            ) : (
              <button onClick={warpIntoAuth} className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest">
                Start Access
              </button>
            )}
          </div>
        )}
      </nav>

      {/* --- PAGE: LANDING --- */}
      {currentPage === 'landing' && (
        <div className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
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
                   <ShieldCheck size={24} className="text-purple-500 md:hidden" />
                   <ShieldCheck size={32} className="text-purple-500 hidden md:block" />
                 </div>
                 <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">Secure Link</h2>
               </div>
               
               <div className="flex gap-1 mb-6 md:mb-8 bg-black/40 p-1 rounded-xl md:rounded-2xl border border-white/5">
                 {['Login', 'Register'].map(tab => (
                   <button key={tab} onClick={() => { setIsLoginView(tab === 'Login'); setAuthError(''); setAuthSuccess(''); }}
                    className={`flex-1 py-2.5 md:py-3 text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-lg md:rounded-xl transition-all ${((tab === 'Login' && isLoginView) || (tab === 'Register' && !isLoginView)) ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-300'}`}
                   >
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
      )}

      {/* --- PAGE: MARKET --- */}
      {currentPage === 'market' && (
        <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto animate-in fade-in duration-700">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
            <aside className="lg:w-64 xl:w-72 space-y-8 md:space-y-10 shrink-0">
               <div>
                 <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4 md:mb-6 flex items-center gap-2"><Search size={12}/> Search Mainframe</h3>
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
                {filteredHouses.map(h => <HouseCard key={h.id} house={h} />)}
              </div>
              {filteredHouses.length === 0 && (
                <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                   <p className="text-zinc-600 font-black uppercase tracking-widest text-[9px]">Zero entities found on this grid.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* --- PAGE: SELL --- */}
      {currentPage === 'sell' && (
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
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <select name="location" className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl p-4 text-[10px] md:text-[11px] font-black uppercase tracking-widest focus:border-purple-500 outline-none">
                {SECTORS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
            <textarea name="description" required className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl p-4 text-[10px] md:text-[11px] font-black uppercase tracking-widest h-24 md:h-32 focus:border-purple-500 outline-none" placeholder="DESCRIBE THE ASSET..."></textarea>
            <button className="w-full bg-white text-black py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all shadow-2xl text-xs md:text-sm">
              Register Listing
            </button>
          </form>
        </div>
      )}

      {/* --- PAGE: PROFILE --- */}
      {currentPage === 'profile' && (
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
          {houses.filter(h => h.ownerId === user.id).length === 0 ? (
            <div className="py-20 text-center bg-white/5 rounded-[2rem] md:rounded-[3rem] border border-dashed border-white/10">
               <p className="text-zinc-600 font-black uppercase tracking-widest text-[8px] md:text-[10px]">No assets found in your portfolio.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {houses.filter(h => h.ownerId === user.id).map(h => <HouseCard key={h.id} house={h} />)}
            </div>
          )}
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="py-16 md:py-24 border-t border-white/5 text-center">
        <div className="text-[8px] md:text-[9px] font-black tracking-[0.5em] text-zinc-800 uppercase px-4">
          Drazen Pavilion • Asset Liquidity • 2077 • Global Neo-Grid Integrated
        </div>
      </footer>

      {/* Custom Global Scrollbar Style */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.5);
        }
      `}} />
    </div>
  );
};

export default App;