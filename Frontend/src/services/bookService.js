import api from '../api/axiosInstance.js';

export async function buscarLibros(q, page = 1) {
  const { data } = await api.get('/books/buscar', { params: { q, page } });
  return data;
}

export async function getLibro(olid) {
  const { data } = await api.get(`/books/${olid}`);
  return data;
}

export async function setEstado(olid, estado) {
  const { data } = await api.put(`/books/${olid}/estado`, { estado });
  return data;
}

export async function setFavorito(olid, es_favorito) {
  const { data } = await api.put(`/books/${olid}/favorito`, { es_favorito });
  return data;
}
