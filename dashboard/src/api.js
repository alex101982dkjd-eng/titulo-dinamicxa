import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('dash_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

API.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('dash_token');
      localStorage.removeItem('dash_usuario');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
