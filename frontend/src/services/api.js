const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add token if available
    const token = localStorage.getItem('york-auth');
    if (token) {
      try {
        const auth = JSON.parse(token);
        if (auth.state?.token) {
          headers.Authorization = `Bearer ${auth.state.token}`;
        }
      } catch (e) {
        // Token parsing failed, continue without it
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  }

  // Auth endpoints
  async signup(email, password) {
    return this.request('/api/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async login(email, password) {
    return this.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/api/v1/auth/logout', {
      method: 'POST',
    });
  }

  // York Characters endpoints
  async getCharacters() {
    return this.request('/api/v1/york-characters');
  }

  async getCharacter(id) {
    return this.request(`/api/v1/york-characters/${id}`);
  }

  async createCharacter(name, description, imageUrl) {
    return this.request('/api/v1/york-characters', {
      method: 'POST',
      body: JSON.stringify({ name, description, imageUrl }),
    });
  }

  // Stories endpoints
  async getStories() {
    return this.request('/api/v1/stories');
  }

  async getStory(id) {
    return this.request(`/api/v1/stories/${id}`);
  }

  async createStory(title, content) {
    return this.request('/api/v1/stories', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
    });
  }

  async updateStory(id, title, content) {
    return this.request(`/api/v1/stories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content }),
    });
  }

  async deleteStory(id) {
    return this.request(`/api/v1/stories/${id}`, {
      method: 'DELETE',
    });
  }

  // Quiz endpoints
  async getQuizzes() {
    return this.request('/api/v1/quiz');
  }

  async getQuiz(id) {
    return this.request(`/api/v1/quiz/${id}`);
  }

  async createQuiz(title, questions) {
    return this.request('/api/v1/quiz', {
      method: 'POST',
      body: JSON.stringify({ title, questions }),
    });
  }

  async submitQuizResult(quizId, score, answers) {
    return this.request(`/api/v1/quiz/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ score, answers }),
    });
  }

  async getUserQuizResults(userId) {
    return this.request(`/api/v1/quiz/results/user/${userId}`);
  }

  // Health endpoints
  async healthCheck() {
    return this.request('/api/health');
  }

  async databaseHealthCheck() {
    return this.request('/api/health/db');
  }
}

export const api = new APIClient(API_URL);
