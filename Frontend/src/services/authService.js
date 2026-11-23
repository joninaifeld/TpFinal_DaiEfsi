import api from '../api/axiosInstance.js';

export async function login(username, password) {
  const { data } = await api.post('/auth/login', { username, password });
  return data;
}

export async function register(username, email, password) {
  const { data } = await api.post('/auth/register', { username, email, password });
  return data;
}
