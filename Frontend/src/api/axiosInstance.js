import axios from 'axios';

let logoutCallback = null;

export function registrarLogout(fn) {
  logoutCallback = fn;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token.trim() !== '') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let redirigiendo = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !redirigiendo) {
      redirigiendo = true;
      if (logoutCallback) logoutCallback();
      window.location.href = '/login';
      setTimeout(() => { redirigiendo = false; }, 2000);
    }
    return Promise.reject(error);
  }
);

export default api;
