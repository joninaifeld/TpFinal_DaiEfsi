import api from '../api/axiosInstance.js';

export async function getResenas(olid) {
  const { data } = await api.get(`/books/${olid}/resenas`);
  return data;
}

export async function guardarResena(olid, payload) {
  const { data } = await api.put(`/books/${olid}/resena`, payload);
  return data;
}

export async function eliminarResena(olid) {
  const { data } = await api.delete(`/books/${olid}/resena`);
  return data;
}
