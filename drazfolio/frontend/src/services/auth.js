import { api } from './api.js';
import firebase from './firebase.js';

// If Firebase is enabled the auth module will use it for registration/login
// and store the returned token in localStorage to keep compatibility with existing api wrapper.
export const authService = {
  login: async (data) => {
    if (firebase.isEnabled) {
      const r = await firebase.loginWithEmail(data.email, data.password);
      localStorage.setItem('token', r.token);
      return r;
    }
    const r = await api.post('/auth/login', data);
    localStorage.setItem('token', r.data.token);
    return r.data;
  },
  register: async (data) => {
    if (firebase.isEnabled) {
      const r = await firebase.registerWithEmail(data.email, data.password);
      localStorage.setItem('token', r.token);
      return r;
    }
    const r = await api.post('/auth/register', data);
    localStorage.setItem('token', r.data.token);
    return r.data;
  },
  me: async () => {
    if (firebase.isEnabled) {
      const token = await firebase.getCurrentUserToken();
      if (!token) throw new Error('Not authenticated');
      // build user shape and include role from Firestore admin mapping
      const fb = await import('./firebase.js');
      const user = fb.getCurrentUser();
      const isAdmin = await fb.isCurrentUserAdmin().catch(() => false);
      return { user: { id: user?.uid, email: user?.email, role: isAdmin ? 'admin' : 'user' }, token };
    }
    const r = await api.get('/auth/me');
    return r.data;
  },
  logout: async () => {
    if (firebase.isEnabled) {
      await firebase.logout();
      localStorage.removeItem('token');
      return { ok: true };
    }
    const r = await api.post('/auth/logout');
    localStorage.removeItem('token');
    return r.data;
  },
  grantAdmin: async (uid, email) => {
    if (!firebase.isEnabled) throw new Error('Firebase not configured');
    const fb = await import('./firebase.js');
    return fb.grantAdminByUid(uid, email);
  },
};

