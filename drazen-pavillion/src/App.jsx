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
import NavBar from './components/NavBar.jsx'
import Landing from './components/Landing.jsx'
import Market from './components/Market.jsx'
import HouseCard from './components/HouseCard.jsx'
import Footer from './components/Footer.jsx'
import SelectedHouseModal from './components/SelectedHouseModal.jsx'
import Sell from './components/Sell.jsx'
import Profile from './components/Profile.jsx'
import { SECTORS, CATEGORIES, getEstateImage, INITIAL_DB } from './data/marketDatabase.jsx'


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

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500 selection:text-white font-sans overflow-x-hidden">
      {/* --- PORTAL EFFECT --- */}
      <div ref={portalRef} className="fixed inset-0 z-[100] hidden items-center justify-center pointer-events-none">
        <div className="portal-disk w-10 h-10 bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 rounded-full blur-3xl opacity-0 scale-0 shadow-[0_0_200px_rgba(168,85,247,0.8)]" />
        <div className="absolute inset-0 bg-black opacity-0" />
      </div>

      {/* --- HOUSE DETAIL & PURCHASE MODAL --- */}
      <SelectedHouseModal
        selectedHouse={selectedHouse}
        setSelectedHouse={setSelectedHouse}
        successMsg={successMsg}
        isProcessing={isProcessing}
        handleTransaction={handleTransaction}
        deleteAsset={deleteAsset}
        user={user}
      />

      {/* NavBar component (desktop + mobile toggle) */}
      <NavBar user={user} triggerPortal={triggerPortal} warpIntoAuth={warpIntoAuth} currentPage={currentPage} setUser={setUser} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Mobile Dropdown (kept in App for simplicity) */}
      {mobileMenuOpen && (
        <div className="absolute top-[64px] left-0 w-full bg-zinc-900 border-b border-white/5 p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300 lg:hidden shadow-2xl">
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

      {/* Landing component (includes auth form) */}
      {currentPage === 'landing' && (
        <Landing showAuthForm={showAuthForm} warpIntoAuth={warpIntoAuth} isLoginView={isLoginView} setIsLoginView={setIsLoginView} triggerPortal={triggerPortal} authError={authError} authSuccess={authSuccess} handleAuth={handleAuth} authForm={authForm} setAuthForm={setAuthForm} />
      )}

      {/* Market (sidebar + listing) */}
      {currentPage === 'market' && (
        <Market filteredHouses={filteredHouses} searchQuery={searchQuery} setSearchQuery={setSearchQuery} activeCategory={activeCategory} setActiveCategory={setActiveCategory} CATEGORIES={CATEGORIES} SECTORS={SECTORS} onInspect={(h) => setSelectedHouse(h)} onDelete={deleteAsset} user={user} />
      )}

      {/* --- PAGE: SELL --- */}
      {currentPage === 'sell' && (
        <Sell addAsset={addAsset} />
      )}

      {/* --- PAGE: PROFILE --- */}
      {currentPage === 'profile' && (
        <Profile user={user} houses={houses} deleteAsset={deleteAsset} />
      )}

      {/* Footer component */}
      <Footer />

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
