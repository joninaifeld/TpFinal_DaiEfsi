import { useState } from "react";
import ColeccionLibroCard from "../ColeccionLibroCard/ColeccionLibroCard";
import libroPlaceholder from "../../assets/LibroPlaceholder.png";
import "./Coleccion.css";

const ESTADOS_FILTRO = [
  { valor: "todos", texto: "Todos" },
  { valor: "quiero_leer", texto: "Quiero leer" },
  { valor: "leyendo", texto: "Leyendo" },
  { valor: "leido", texto: "Leído" },
  { valor: "abandonado", texto: "Abandonado" },
];

const ORDENES = [
  { valor: "ninguno", texto: "Ordenar por..." },
  { valor: "titulo", texto: "Título (A-Z)" },
  { valor: "rating", texto: "Mejor calificados" },
];

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const COLECCION = {
  nombre: "PLACEHOLDER",
  descripcion: LOREM,
  libros: [
    { id: 1,  titulo: "PLACEHOLDER", autor: "PLACEHOLDER", portada: libroPlaceholder, rating: 4.2, votos: 120, genero: "Ficción",   estado: "leido",       favorito: false },
    { id: 2,  titulo: "PLACEHOLDER", autor: "PLACEHOLDER", portada: libroPlaceholder, rating: 4.5, votos: 98,  genero: "Fantasía",  estado: "leyendo",     favorito: true  },
    { id: 3,  titulo: "PLACEHOLDER", autor: "PLACEHOLDER", portada: libroPlaceholder, rating: 3.8, votos: 60,  genero: "Misterio",  estado: "quiero_leer", favorito: false },
    { id: 4,  titulo: "PLACEHOLDER", autor: "PLACEHOLDER", portada: libroPlaceholder, rating: 4.0, votos: 75,  genero: "Historia",  estado: "leido",       favorito: true  },
    { id: 5,  titulo: "PLACEHOLDER", autor: "PLACEHOLDER", portada: libroPlaceholder, rating: 4.7, votos: 200, genero: "Ficción",   estado: "abandonado",  favorito: false },
    { id: 6,  titulo: "PLACEHOLDER", autor: "PLACEHOLDER", portada: libroPlaceholder, rating: 4.1, votos: 55,  genero: "Fantasía",  estado: "leido",       favorito: false },
    { id: 7,  titulo: "PLACEHOLDER", autor: "PLACEHOLDER", portada: libroPlaceholder, rating: 3.5, votos: 40,  genero: "Misterio",  estado: "quiero_leer", favorito: true  },
    { id: 8,  titulo: "PLACEHOLDER", autor: "PLACEHOLDER", portada: libroPlaceholder, rating: 4.9, votos: 310, genero: "Ficción",   estado: "leido",       favorito: true  },
  ],
};

function IconoLapiz() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function Coleccion() {
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [orden, setOrden] = useState("ninguno");

  const librosFiltrados = COLECCION.libros.filter((libro) => {
    const coincideEstado = filtroEstado === "todos" || libro.estado === filtroEstado;
    const coincideFavorito = !soloFavoritos || libro.favorito;
    return coincideEstado && coincideFavorito;
  });

  const librosOrdenados = [...librosFiltrados];
  if (orden === "titulo") {
    librosOrdenados.sort((a, b) => a.titulo.localeCompare(b.titulo));
  } else if (orden === "rating") {
    librosOrdenados.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="coleccion">
      <div className="coleccion__encabezado">
        <div className="coleccion__titulo_fila">
          <h1 className="coleccion__titulo">{COLECCION.nombre}</h1>
          <button type="button" className="coleccion__btn_editar" aria-label="Editar nombre">
            <IconoLapiz />
          </button>
        </div>
        <div className="coleccion__descripcion_fila">
          <p className="coleccion__descripcion">{COLECCION.descripcion}</p>
          <button type="button" className="coleccion__btn_editar coleccion__btn_editar--desc" aria-label="Editar descripción">
            <IconoLapiz />
          </button>
        </div>
      </div>

      <div className="coleccion__controles">
        <div className="coleccion__filtros_grupo">
          <div className="coleccion__filtros">
            {ESTADOS_FILTRO.map(({ valor, texto }) => (
              <button
                key={valor}
                type="button"
                className={`coleccion__filtro_btn${filtroEstado === valor ? " coleccion__filtro_btn--activo" : ""}`}
                onClick={() => setFiltroEstado(valor)}
              >
                {texto}
              </button>
            ))}
          </div>

          <div className="coleccion__separador_v" />

          <button
            type="button"
            className={`coleccion__favoritos_btn${soloFavoritos ? " coleccion__favoritos_btn--activo" : ""}`}
            onClick={() => setSoloFavoritos(!soloFavoritos)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={soloFavoritos ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.6 4.5 6.3 4.5c2.1 0 3.6 1.1 4.5 2.6.3.5 1.1.5 1.4 0 .9-1.5 2.4-2.6 4.5-2.6 3.7 0 5.4 3.9 3.9 7.3C19.5 16.4 12 21 12 21z" />
            </svg>
            Favoritos
          </button>
        </div>

        <div className="coleccion__controles_derecha">
          <div className="coleccion__buscador">
            <svg className="coleccion__buscador_icono" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              className="coleccion__buscador_input"
              placeholder="Buscar en mi colección..."
            />
          </div>

          <select
            className="coleccion__orden"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            {ORDENES.map(({ valor, texto }) => (
              <option key={valor} value={valor}>{texto}</option>
            ))}
          </select>
        </div>
      </div>

      {librosOrdenados.length === 0 ? (
        <p className="coleccion__vacio">No hay libros con ese filtro.</p>
      ) : (
        <div className="coleccion__grilla">
          {librosOrdenados.map((libro) => (
            <ColeccionLibroCard
              key={libro.id}
              libro={libro}
              onFavorito={(val) => console.log("favorito", libro.id, val)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Coleccion;
