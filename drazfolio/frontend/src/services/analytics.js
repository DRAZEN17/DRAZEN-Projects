import { api } from './api.js';

function sendToServer(payload) { return api.post('/analytics/track', payload).catch(() => {}); }

export const trackPageView = (path) => {
  // if gtag is present, use it first
  try { if (window.gtag) window.gtag('event', 'page_view', { page_path: path }); } catch {}
  return sendToServer({ type: 'page_view', path, referrer: document.referrer });
};

export const trackProjectClick = (refId) => {
  try { if (window.gtag) window.gtag('event', 'project_click', { event_label: refId }); } catch {}
  return sendToServer({ type: 'project_click', refId });
};

export const trackBlogView = (refId) => {
  try { if (window.gtag) window.gtag('event', 'blog_view', { event_label: refId }); } catch {}
  return sendToServer({ type: 'blog_view', refId });
};

export const fetchAnalyticsSummary = () => api.get('/analytics/summary').then((r) => r.data);
