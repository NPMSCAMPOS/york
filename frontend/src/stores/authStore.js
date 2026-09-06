import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
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
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
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
    }),
    {
      name: 'york-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
