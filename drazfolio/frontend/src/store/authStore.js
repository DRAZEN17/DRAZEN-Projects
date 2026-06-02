import { create } from 'zustand';
import { authService } from '../services/auth.js';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  loading: false,
  hydrate: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    set({ token });
    try {
      const { user } = await authService.me();
      set({ user });
    } catch {
      localStorage.removeItem('token');
      set({ token: null, user: null });
    }
  },
  login: async (email, password) => {
    set({ loading: true });
    try {
      const { token, user } = await authService.login({ email, password });
      localStorage.setItem('token', token);
      set({ token, user });
      return user;
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    await authService.logout().catch(() => {});
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
  isAdmin: () => get().user?.role === 'admin',
}));
