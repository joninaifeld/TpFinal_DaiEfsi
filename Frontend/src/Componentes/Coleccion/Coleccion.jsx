import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getColeccion, quitarLibro, actualizarColeccion } from "../../services/collectionService.js";
import ColeccionLibroCard from "../ColeccionLibroCard/ColeccionLibroCard";
import { setFavorito } from "../../services/bookService.js";
import "./Coleccion.css";

const ESTADOS_FILTRO = [
  { valor: "todos", texto: "Todos" },
  { valor: "Quiero leer", texto: "Quiero leer" },
  { valor: "Leyendo", texto: "Leyendo" },
  { valor: "Leído", texto: "Leído" },
  { valor: "Abandonado", texto: "Abandonado" },
];

const ORDENES = [
  { valor: "ninguno", texto: "Ordenar por..." },
  { valor: "titulo", texto: "Título (A-Z)" },
];

function IconoLapiz() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function Coleccion() {
  const { id } = useParams();
  const [coleccion, setColeccion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [orden, setOrden] = useState("ninguno");
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [nombreInput, setNombreInput] = useState('');

  useEffect(() => {
    if (!id) return;
    getColeccion(id)
      .then((data) => {
        setColeccion(data);
        setNombreInput(data.nombre);
      })
      .catch(() => setError('No se pudo cargar la colección.'))
      .finally(() => setCargando(false));
  }, [id]);

  const guardarNombre = async () => {
    if (!nombreInput.trim()) return;
    try {
      const res = await actualizarColeccion(id, { nombre: nombreInput.trim() });
      setColeccion((prev) => ({ ...prev, nombre: res.coleccion?.nombre ?? nombreInput.trim() }));
      setEditandoNombre(false);
    } catch {}
  };

  const handleFavorito = async (libro, val) => {
    try {
      await setFavorito(libro.openlibrary_key, val);
      setColeccion((prev) => ({
        ...prev,
        libros: prev.libros.map((l) =>
          l.openlibrary_key === libro.openlibrary_key ? { ...l, es_favorito: val } : l
        ),
      }));
    } catch {}
  };

  const handleQuitar = async (libro) => {
    try {
      await quitarLibro(id, libro.openlibrary_key);
      setColeccion((prev) => ({
        ...prev,
        libros: prev.libros.filter((l) => l.openlibrary_key !== libro.openlibrary_key),
      }));
    } catch {}
  };

  if (cargando) return <div className="coleccion"><p>Cargando...</p></div>;
  if (error) return <div className="coleccion"><p>{error}</p></div>;
  if (!coleccion) return null;

  const libros = coleccion.libros ?? [];

  const librosFiltrados = libros.filter((libro) => {
    const coincideEstado = filtroEstado === "todos" || libro.estado === filtroEstado;
    const coincideFavorito = !soloFavoritos || libro.es_favorito;
    return coincideEstado && coincideFavorito;
  });

  const librosOrdenados = [...librosFiltrados];
  if (orden === "titulo") {
    librosOrdenados.sort((a, b) => a.titulo.localeCompare(b.titulo));
  }

  return (
    <div className="coleccion">
      <div className="coleccion__encabezado">
        <div className="coleccion__titulo_fila">
          {editandoNombre ? (
            <>
              <input
                className="coleccion__nombre_input"
                value={nombreInput}
                onChange={(e) => setNombreInput(e.target.value)}
              />
              <button type="button" className="coleccion__btn_editar" onClick={guardarNombre}>Guardar</button>
              <button type="button" className="coleccion__btn_editar" onClick={() => setEditandoNombre(false)}>Cancelar</button>
            </>
          ) : (
            <>
              <h1 className="coleccion__titulo">{coleccion.nombre}</h1>
              <button type="button" className="coleccion__btn_editar" aria-label="Editar nombre" onClick={() => setEditandoNombre(true)}>
                <IconoLapiz />
              </button>
            </>
          )}
        </div>
        {coleccion.descripcion && (
          <p className="coleccion__descripcion">{coleccion.descripcion}</p>
        )}
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
              key={libro.openlibrary_key ?? libro.id}
              libro={libro}
              onFavorito={(val) => handleFavorito(libro, val)}
              onQuitar={() => handleQuitar(libro)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Coleccion;
