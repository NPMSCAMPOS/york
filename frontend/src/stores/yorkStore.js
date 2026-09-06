import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const auth = useAuthStore.getState();
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

import { useAuthStore } from './authStore';

function toFlatYork(data) {
  return {
    name: data.name,
    avatar: data.appearance?.avatar,
    color: data.appearance?.color,
    personality: data.appearance?.personality,
    createdAt: data.createdAt,
  };
}

export const useYorkStore = create(
  persist(
    (set, get) => ({
      yorkId: null,
      york: null,
      loading: false,
      error: null,

      createYork: async ({ name, avatar, color, personality, ageGroup }) => {
        set({ loading: true, error: null });
        try {
          const { data } = await api.post('/api/v1/york-characters', {
            name,
            appearance: { avatar, color, personality },
            ageGroup,
          });
          set({ yorkId: data.id, york: toFlatYork(data), loading: false });
          return { ok: true };
        } catch (err) {
          const message = err.response?.data?.error || 'Erro ao criar York';
          set({ error: message, loading: false });
          return { ok: false, error: message };
        }
      },

      fetchYork: async (id) => {
        const yorkId = id || get().yorkId;
        if (!yorkId) return { ok: false, error: 'Nenhum York salvo' };

        set({ loading: true, error: null });
        try {
          const { data } = await api.get(`/api/v1/york-characters/${yorkId}`);
          set({ yorkId: data.id, york: toFlatYork(data), loading: false });
          return { ok: true };
        } catch (err) {
          const message = err.response?.data?.error || 'Erro ao carregar York';
          set({ error: message, loading: false });
          return { ok: false, error: message };
        }
      },

      resetYork: () => {
        set({ yorkId: null, york: null, error: null });
      },
    }),
    {
      name: 'york-character',
      partialize: (state) => ({ yorkId: state.yorkId }),
    }
  )
);
