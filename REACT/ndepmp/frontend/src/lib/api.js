import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Attaches the access token once the auth backend exists — this is the
// seam it plugs into, nothing to rewire later.
api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('ndepmp-access-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
