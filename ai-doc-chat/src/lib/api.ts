import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }).then(res => res.data),
  signup: (email: string, password: string, name: string) =>
    api.post('/api/auth/signup', { email, password, name }).then(res => res.data),
  getCurrentUser: () => api.get('/api/auth/me').then(res => res.data),
};

export const chatsAPI = {
  getAll: () => api.get('/api/chats').then(res => res.data),
  getById: (id: string) => api.get(`/api/chats/${id}`).then(res => res.data),
  create: () => api.post('/api/chats').then(res => res.data),
  delete: (id: string) => api.delete(`/api/chats/${id}`).then(res => res.data),
};

export const messagesAPI = {
  send: (chatId: string, content: string) =>
    api.post(`/api/chats/${chatId}/messages`, { content }).then(res => res.data),
};

export default api;