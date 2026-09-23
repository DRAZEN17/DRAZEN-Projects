import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Hero from './components/Hero';
import MainContent from './components/MainContent';
import AuthModal from './components/AuthModal';
import DetailModal from './components/DetailModal';
import { fetchContent } from './components/api';

export default function App() {
  const [view, setView] = useState('anime');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [heading, setHeading] = useState('Top Picks');
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem('anidar-saved-ids') || '[]');
      return new Set(parsed);
    } catch {
      return new Set();
    }
  });

  const loadItems = async (nextView = view, nextSearch = searchQuery) => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchContent(nextView, nextSearch);
      setItems(Array.isArray(data) ? data : []);
      setHeading(nextSearch ? `Results for "${nextSearch}"` : nextView === 'anime' ? 'Top Anime' : nextView === 'manga' ? 'Top Manga' : 'Top Manhwa');
    } catch (err) {
      console.error(err);
      setItems([]);
      setError('Unable to load content right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadItems('anime', '');
    };
    init();
  }, []);

  useEffect(() => {
    localStorage.setItem('anidar-saved-ids', JSON.stringify([...savedIds]));
  }, [savedIds]);

  const handleSearch = async (event) => {
    event.preventDefault();
    await loadItems(view, searchQuery.trim());
  };

  const toggleSave = (id) => {
    setSavedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExternalLink = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleAuth = (event) => {
    event.preventDefault();
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white antialiased">
      <Hero
        view={view}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      <MainContent
        loading={loading}
        items={items}
        setSelectedItem={setSelectedItem}
        savedIds={savedIds}
        heading={heading}
        error={error}
      />

      <AuthModal
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        handleAuth={handleAuth}
      />

      <DetailModal
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        handleExternalLink={handleExternalLink}
        toggleSave={toggleSave}
        savedIds={savedIds}
        view={view}
      />
    </div>
  );
}

const rootElement = document.getElementById('root');
const existingRoot = rootElement?._reactRoot;

const root = existingRoot || ReactDOM.createRoot(rootElement);
if (rootElement) rootElement._reactRoot = root;

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
