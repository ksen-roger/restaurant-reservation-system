import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attaches the JWT to every request automatically —
// like an interceptor adding the Authorization header for you,
// so you don't repeat this logic in every single page.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;