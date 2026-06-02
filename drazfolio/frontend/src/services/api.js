import { handleRequest } from './mockBackend.js';

// Minimal axios-like client that routes to the in-browser mock backend.
export const api = {
  defaults: { baseURL: '' },
  async request(config) {
    const token = localStorage.getItem('token');
    const headers = { ...(config.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    try {
      const res = await handleRequest((config.method || 'get').toUpperCase(), (config.url || ''), { data: config.data, params: config.params, headers, config });
      return res;
    } catch (e) {
      if (e?.response?.status === 401) localStorage.removeItem('token');
      throw e;
    }
  },
  get(url, opts) { return this.request({ method: 'get', url, params: opts?.params, headers: opts?.headers }); },
  post(url, data, config) { return this.request({ method: 'post', url, data, headers: config?.headers, config }); },
  put(url, data) { return this.request({ method: 'put', url, data }); },
  delete(url) { return this.request({ method: 'delete', url }); },
  patch(url, data) { return this.request({ method: 'patch', url, data }); },
};
