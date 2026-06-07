import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_URL?.trim();
const normalizedBaseURL = rawBaseURL
  ? rawBaseURL.replace(/\/+$/, '').endsWith('/api')
    ? rawBaseURL.replace(/\/+$/, '')
    : `${rawBaseURL.replace(/\/+$/, '')}/api`
  : '/api';

const api = axios.create({
  baseURL: normalizedBaseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
