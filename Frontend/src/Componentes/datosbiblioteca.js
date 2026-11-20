// Datos de ejemplo. Cuando tengas la base de datos, reemplazalos por el fetch.
const hace = (dias) => new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString();

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

export const coleccionesPrueba = [
  { id: 1, nombre: "nombre de la coleccion", descripcion: LOREM, cantidadLibros: 8, actualizadoEn: hace(2) },
  { id: 2, nombre: "nombre de la coleccion", descripcion: LOREM, cantidadLibros: 8, actualizadoEn: hace(2) },
  { id: 3, nombre: "nombre de la coleccion", descripcion: LOREM, cantidadLibros: 8, actualizadoEn: hace(2) },
];