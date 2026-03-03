import React, { useState, useEffect } from 'react';
import { Search, User, X, Bookmark, ExternalLink, Loader2, Menu } from 'lucide-react';
import { fetchContent } from './components/api.jsx';
import AuthModal from './components/AuthModal.jsx';
import DetailModal from './components/DetailModal.jsx';
import Footer from './components/Footer.jsx';

const App = () => {
  const [view, setView] = useState('anime');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [savedIds, setSavedIds] = useState(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const triggerToast = (msg) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  };

  const fetchAndSet = async (currentView, search = '') => {
    setLoading(true);
    try {
      const result = await fetchContent(currentView, search);
      setItems(result || []);
    } catch (error) {
      console.error('Fetch Error:', error);
      triggerToast('Network issue. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAndSet(view); }, [view]);

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchAndSet(view, searchQuery);
  };

  const handleAuth = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      setUserEmail(email);
      setIsLoggedIn(true);
      setShowAuthModal(false);
      triggerToast(`Welcome, ${email.split('@')[0]}!`);
    }
  };

  const toggleSave = (id) => {
    if (!isLoggedIn) {
      setSelectedItem(null);
      setShowAuthModal(true);
      triggerToast('Please sign in to save favorites!');
      return;
    }
    setSavedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        triggerToast('Removed from watchlist');
      } else {
        newSet.add(id);
        triggerToast('Saved to watchlist!');
      }
      return newSet;
    });
  };

  const handleExternalLink = (url) => {
    if (!isLoggedIn) {
      setSelectedItem(null);
      setShowAuthModal(true);
      triggerToast('Please sign in to view full details!');
      return;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-red-500 selection:text-white font-['Plus_Jakarta_Sans']">
      {toast.visible && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-red-600 px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm md:text-base animate-bounce whitespace-nowrap">
          {toast.message}
        </div>
      )}

      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-xl border-b border-white/5 px-4 md:px-6 py-4 flex justify-between items-center">
        <div className="text-xl md:text-2xl font-black tracking-tighter cursor-pointer" onClick={() => { setView('anime'); setSearchQuery(''); }}>ANIDAR<span className="text-red-500">.</span></div>
        <div className="hidden md:flex space-x-8 text-[10px] font-black uppercase tracking-[0.2em]">
          {['anime','manga','manhwa'].map(t => (
            <button key={t} onClick={() => setView(t)} className={`hover:text-red-500 transition-colors ${view===t ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}>{t}</button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setShowAuthModal(true)} className={`flex items-center space-x-2 px-4 md:px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all ${isLoggedIn ? 'bg-white/5 border border-white/10' : 'bg-red-600 hover:bg-red-700'}`}>
            <User size={14} />
            <span className="hidden sm:inline">{isLoggedIn ? userEmail.split('@')[0] : 'Account'}</span>
          </button>
          <button className="md:hidden p-2 text-gray-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#0a0a0c] border-b border-white/5 py-4 flex flex-col items-center space-y-4 md:hidden">
            {['anime','manga','manhwa'].map(t => (
              <button key={t} onClick={() => { setView(t); setIsMobileMenuOpen(false); }} className={`text-[10px] font-black uppercase tracking-[0.2em] ${view===t ? 'text-red-500' : 'text-gray-400'}`}>{t}</button>
            ))}
          </div>
        )}
      </nav>

      <header className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-20 scale-105" alt="Hero Background" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />
        </div>
        <div className="relative z-10 text-center w-full max-w-2xl mt-12">
          <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter mb-4 leading-none">Your <br /> <span className="text-red-600">Anime Radar</span></h1>
          <form onSubmit={handleSearch} className="relative mt-8 group mx-auto max-w-lg md:max-w-none">
            <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder={`Search ${view}...`} className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-5 md:px-6 py-3 md:py-4 outline-none focus:border-red-600 transition-all text-base md:text-lg" />
            <button type="submit" className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-red-600 p-2 rounded-xl hover:bg-red-700 transition"><Search size={18} /></button>
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="flex items-center space-x-4 mb-8 md:mb-10">
          <h2 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter">{searchQuery ? `Searching: ${searchQuery}` : `Top ${view}`}</h2>
          <div className="h-[2px] flex-1 bg-gradient-to-r from-red-600 to-transparent opacity-20" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 text-gray-500">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="uppercase tracking-widest text-[10px] font-bold">Synchronizing Database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {items.map(item => (
              <div key={item.mal_id} onClick={()=>setSelectedItem(item)} className="group relative bg-white/5 border border-white/5 rounded-xl md:rounded-2xl overflow-hidden cursor-pointer hover:border-red-500/50 transition-all active:scale-95 md:hover:-translate-y-2">
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

      <AuthModal showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal} handleAuth={handleAuth} />
      <DetailModal selectedItem={selectedItem} setSelectedItem={setSelectedItem} handleExternalLink={handleExternalLink} toggleSave={toggleSave} savedIds={savedIds} />

      <Footer />
    </div>
  );
};

export default App;
