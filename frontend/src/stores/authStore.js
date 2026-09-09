import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../services/api.js';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      loading: false,
      error: null,

      register: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const data = await api.signup(email, password);
          set({ token: data.token, user: data.user, loading: false });
          return { ok: true };
        } catch (err) {
          set({ error: err.message, loading: false });
          return { ok: false, error: err.message };
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const data = await api.login(email, password);
          set({ token: data.token, user: data.user, loading: false });
          return { ok: true };
        } catch (err) {
          set({ error: err.message, loading: false });
          return { ok: false, error: err.message };
        }
      },

      logout: () => {
        set({ token: null, user: null, error: null });
      },

      clearError: () => {
        set({ error: null });
      },

      setUser: (user) => {
        set({ user });
      },
    }),
    {
      name: 'york-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
