import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

export function useStories() {
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState(null);
  const [error, setError] = useState(null);
  const token = useAuthStore((s) => s.token);

  const generateStory = async (yorkName, theme, ageGroup) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/api/v1/stories', {
        yorkName,
        theme,
        ageGroup,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStory(data.story);
      return { ok: true, story: data.story };
    } catch (err) {
      const message = err.response?.data?.error || 'Erro ao gerar história';
      setError(message);
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { loading, story, error, generateStory };
}
