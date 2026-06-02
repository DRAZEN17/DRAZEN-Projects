import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#0b0d14', color: '#e7e9f0', border: '1px solid rgba(255,255,255,0.1)' } }} />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
