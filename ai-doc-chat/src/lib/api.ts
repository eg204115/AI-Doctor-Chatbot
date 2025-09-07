import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then(res => res.data),
  signup: (email: string, password: string, name: string) =>
    api.post('/auth/signup', { email, password, name }).then(res => res.data),
  getCurrentUser: () => api.get('/auth/me').then(res => res.data),
};

export const chatsAPI = {
  getAll: () => api.get('/chats').then(res => res.data),
  getById: (id: string) => api.get(`/chats/${id}`).then(res => res.data),
  create: () => api.post('/chats').then(res => res.data),
  delete: (id: string) => api.delete(`/chats/${id}`).then(res => res.data),
};

export const messagesAPI = {
  send: (chatId: string, content: string) =>
    api.post(`/chats/${chatId}/messages`, { content }).then(res => res.data),
};

export default api;