import api from '../api/axiosInstance.js';

export async function getColecciones() {
  const { data } = await api.get('/colecciones');
  return data;
}

export async function getColeccion(id) {
  const { data } = await api.get(`/colecciones/${id}`);
  return data;
}

export async function crearColeccion(payload) {
  const { data } = await api.post('/colecciones', payload);
  return data;
}

export async function actualizarColeccion(id, payload) {
  const { data } = await api.put(`/colecciones/${id}`, payload);
  return data;
}

export async function eliminarColeccion(id) {
  const { data } = await api.delete(`/colecciones/${id}`);
  return data;
}

export async function agregarLibro(coleccionId, olid) {
  const { data } = await api.post(`/colecciones/${coleccionId}/libros`, { olid });
  return data;
}

export async function quitarLibro(coleccionId, olid) {
  const { data } = await api.delete(`/colecciones/${coleccionId}/libros/${olid}`);
  return data;
}
