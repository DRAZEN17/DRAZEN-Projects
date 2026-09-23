import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Hero from './components/Hero';
import MainContent from './components/MainContent';

export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('anime');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedIds, setSavedIds] = useState(new Set());
  const [selectedItem, setSelectedItem] = useState(null);
  const items = [];

  const handleSearch = (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      setError('Search is not connected yet.');
    }, 300);
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
        heading="Top Picks"
        error={error}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
