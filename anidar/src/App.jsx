import React, { useState, useEffect } from 'react';
import { fetchContent } from './components/api.jsx';
import NavBar from './components/NavBar.jsx';
import Hero from './components/Hero.jsx';
import MainContent from './components/MainContent.jsx';
import AuthModal from './components/AuthModal.jsx';
import DetailModal from './components/DetailModal.jsx';
import Footer from './components/Footer.jsx';

const App = () => {
  const [view, setView] = useState('anime');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    setError('');
    try {
      const result = await fetchContent(currentView, search);
      setItems(result || []);
      if (!result || result.length === 0) {
        setError(search ? 'No results found. Try a different query.' : 'No content available right now. Please try again later.');
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setItems([]);
      setError('Unable to load content at the moment. Please try again later.');
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

      <NavBar
        view={view}
        setView={setView}
        setSearchQuery={setSearchQuery}
        setShowAuthModal={setShowAuthModal}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <Hero view={view} searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} />

      <MainContent
        loading={loading}
        items={items}
        setSelectedItem={setSelectedItem}
        savedIds={savedIds}
        error={error}
        heading={searchQuery ? `Searching: ${searchQuery}` : `Top ${view}`}
      />

      <AuthModal showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal} handleAuth={handleAuth} />
      <DetailModal selectedItem={selectedItem} setSelectedItem={setSelectedItem} handleExternalLink={handleExternalLink} toggleSave={toggleSave} savedIds={savedIds} view={view} />

      <Footer />
    </div>
  );
};

export default App;
