import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { QueryProvider } from '@/lib/queryClient';
import { MockBackendProvider } from '@/lib/mockBackend';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <ThemeProvider>
          <QueryProvider>
            <MockBackendProvider>
              <App />
            </MockBackendProvider>
          </QueryProvider>
        </ThemeProvider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
);
