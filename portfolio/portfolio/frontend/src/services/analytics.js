import { api } from './api.js';

export const trackPageView = (path) =>
  api.post('/analytics/track', { type: 'page_view', path, referrer: document.referrer }).catch(() => {});

export const trackProjectClick = (refId) =>
  api.post('/analytics/track', { type: 'project_click', refId }).catch(() => {});

export const trackBlogView = (refId) =>
  api.post('/analytics/track', { type: 'blog_view', refId }).catch(() => {});

export const fetchAnalyticsSummary = () => api.get('/analytics/summary').then((r) => r.data);
