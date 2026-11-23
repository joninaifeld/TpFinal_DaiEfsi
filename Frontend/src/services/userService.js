import api from '../api/axiosInstance.js';

export async function getPerfil() {
  const { data } = await api.get('/usuarios/perfil');
  return data;
}

export async function updatePerfil(profileData) {
  const { data } = await api.put('/usuarios/perfil', profileData);
  return data;
}

export async function getLibros(params) {
  const { data } = await api.get('/usuarios/libros', { params });
  return data;
}

export async function getEstadisticas() {
  const { data } = await api.get('/usuarios/estadisticas');
  return data;
}

export async function getActividad(limit) {
  const { data } = await api.get('/usuarios/actividad', { params: limit ? { limit } : undefined });
  return data;
}

export async function getResenas() {
  const { data } = await api.get('/usuarios/resenas');
  return data;
}
