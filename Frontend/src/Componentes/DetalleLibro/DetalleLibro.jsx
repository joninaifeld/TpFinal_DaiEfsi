import { useEffect, useState } from "react";
import { getLibro, setEstado, setFavorito } from "../../services/bookService.js";
import { getResenas, guardarResena, eliminarResena } from "../../services/reviewService.js";
import { getLibros } from "../../services/userService.js";
import { getColecciones, agregarLibro } from "../../services/collectionService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import CampoEtiquetas from "../CampoEtiquetas/CampoEtiquetas";
import "./DetalleLibro.css";

const ESTADOS = ['Quiero leer', 'Leyendo', 'Leído', 'Abandonado'];

function DetalleLibro({ olid }) {
  const { user } = useAuth();
  const [libro, setLibro] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [noEncontrado, setNoEncontrado] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [estadoActual, setEstadoActual] = useState('');
  const [errorEstado, setErrorEstado] = useState('');
  const [puntuacion, setPuntuacion] = useState(5);
  const [resenaTexto, setResenaTexto] = useState('');
  const [errorResena, setErrorResena] = useState('');
  const [guardandoResena, setGuardandoResena] = useState(false);
  const [colecciones, setColecciones] = useState([]);
  const [coleccionSel, setColeccionSel] = useState('');
  const [mensajeColeccion, setMensajeColeccion] = useState('');

  useEffect(() => {
    if (!olid) return;
    async function cargar() {
      const [libroData, resenasData, librosData, colsData] = await Promise.allSettled([
        getLibro(olid),
        getResenas(olid),
        getLibros(),
        getColecciones(),
      ]);
      if (libroData.status === 'fulfilled') {
        setLibro(libroData.value);
      } else {
        setNoEncontrado(true);
      }
      if (resenasData.status === 'fulfilled') {
        setResenas(resenasData.value.resenas ?? []);
      }
      if (librosData.status === 'fulfilled') {
        const libroUsuario = librosData.value.find((l) => l.openlibrary_key === olid);
        if (libroUsuario) {
          setEstadoActual(libroUsuario.estado || '');
          setGuardado(libroUsuario.es_favorito || false);
        }
      }
      if (colsData.status === 'fulfilled') {
        setColecciones(colsData.value);
      }
      setCargando(false);
    }
    cargar();
  }, [olid]);

  const agregarAColeccion = async (e) => {
    e.preventDefault();
    if (!coleccionSel) return;
    setMensajeColeccion('');
    try {
      await agregarLibro(coleccionSel, olid);
      setMensajeColeccion('Libro agregado a la colección.');
      setColeccionSel('');
    } catch (err) {
      setMensajeColeccion(err.response?.data?.error || 'No se pudo agregar a la colección.');
    }
  };

  const cambiarEstado = async (nuevoEstado) => {
    setErrorEstado('');
    try {
      await setEstado(olid, nuevoEstado);
      setEstadoActual(nuevoEstado);
      setGuardado(true);
    } catch (err) {
      setErrorEstado(err.response?.data?.error || 'Error al cambiar estado.');
    }
  };

  const toggleFavorito = async () => {
    try {
      await setFavorito(olid, !guardado);
      setGuardado((prev) => !prev);
    } catch {}
  };

  const submitResena = async (e) => {
    e.preventDefault();
    if (puntuacion < 1 || puntuacion > 5) return;
    setErrorResena('');
    setGuardandoResena(true);
    try {
      await guardarResena(olid, {
        puntuacion,
        resena_texto: resenaTexto.trim() || null,
        titulo: libro?.titulo,
        cover_url: libro?.cover_url,
      });
      const updated = await getResenas(olid);
      setResenas(updated.resenas ?? []);
      setResenaTexto('');
    } catch (err) {
      setErrorResena(err.response?.data?.error || 'Error al guardar la reseña.');
    } finally {
      setGuardandoResena(false);
    }
  };

  const borrarResena = async () => {
    try {
      await eliminarResena(olid);
      const updated = await getResenas(olid);
      setResenas(updated.resenas ?? []);
    } catch {}
  };

  if (cargando) return <main className="detalle"><p>Cargando...</p></main>;
  if (noEncontrado) return <main className="detalle"><p>Libro no encontrado.</p></main>;
  if (!libro) return null;

  const {
    titulo,
    cover_url,
    descripcion,
    generos,
  } = libro;

  return (
    <main className="detalle">
      <div className="detalle__portada-col">
        <div
          className="detalle__portada"
          style={cover_url ? { backgroundImage: `url(${cover_url})` } : undefined}
          role={cover_url ? "img" : undefined}
          aria-label={cover_url ? `Portada de ${titulo}` : undefined}
        >
          {!cover_url && <span>Libro</span>}
        </div>

        <button
          type="button"
          className={guardado ? "detalle__guardar detalle__guardar--activo" : "detalle__guardar"}
          aria-label={guardado ? "Quitar de favoritos" : "Agregar a favoritos"}
          aria-pressed={guardado}
          onClick={toggleFavorito}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M5 3h11l4 4v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm2 2v5h9V5H7zm5 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
          </svg>
        </button>
      </div>

      <article className="detalle__tarjeta">
        <h1 className="detalle__titulo">{titulo}</h1>

        <div className="detalle__campos">
          {generos?.length > 0 && <CampoEtiquetas titulo="géneros" etiquetas={generos} />}
        </div>

        {descripcion && (
          <>
            <p className="detalle__descripcion-label">Descripción</p>
            <div className="detalle__descripcion">{descripcion}</div>
          </>
        )}

        <div className="detalle__estado">
          <p className="detalle__estado_label">Estado de lectura</p>
          <div className="detalle__estado_botones">
            {ESTADOS.map((e) => (
              <button
                key={e}
                type="button"
                className={`detalle__estado_btn${estadoActual === e ? ' detalle__estado_btn--activo' : ''}`}
                onClick={() => cambiarEstado(e)}
              >
                {e}
              </button>
            ))}
          </div>
          {errorEstado && <p className="detalle__error">{errorEstado}</p>}
        </div>

        {colecciones.length > 0 && (
          <div className="detalle__coleccion">
            <p className="detalle__estado_label">Agregar a una colección</p>
            <form onSubmit={agregarAColeccion} className="detalle__coleccion_form">
              <select
                value={coleccionSel}
                onChange={(e) => setColeccionSel(e.target.value)}
                className="detalle__coleccion_select"
              >
                <option value="">Elegí una colección...</option>
                {colecciones.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              <button type="submit" className="detalle__coleccion_btn" disabled={!coleccionSel}>
                Agregar
              </button>
            </form>
            {mensajeColeccion && <p className="detalle__error">{mensajeColeccion}</p>}
          </div>
        )}

        <div className="detalle__resena">
          <h2 className="detalle__resena_titulo">Dejar una valoración</h2>
          <form onSubmit={submitResena}>
            <label className="detalle__resena_label">
              Puntuación (1-5)
              <input
                type="number"
                min={1}
                max={5}
                value={puntuacion}
                onChange={(e) => setPuntuacion(Number(e.target.value))}
                className="detalle__resena_puntuacion"
              />
            </label>
            <textarea
              className="detalle__resena_texto"
              placeholder="Escribí tu reseña (opcional)"
              value={resenaTexto}
              onChange={(e) => setResenaTexto(e.target.value)}
              rows={3}
            />
            {errorResena && <p className="detalle__error">{errorResena}</p>}
            <button type="submit" className="detalle__resena_btn" disabled={guardandoResena}>
              {guardandoResena ? 'Guardando...' : 'Guardar valoración'}
            </button>
          </form>
        </div>

        {resenas.length > 0 && (
          <div className="detalle__resenas_lista">
            <h2 className="detalle__resena_titulo">Valoraciones</h2>
            {resenas.map((r) => (
              <div key={r.id} className="detalle__resena_item">
                <strong>{r.username}</strong> — {r.puntuacion}/5
                {r.resena_texto && <p>{r.resena_texto}</p>}
                {r.usuario_id === user?.id && (
                  <button type="button" className="detalle__resena_eliminar" onClick={borrarResena}>
                    Eliminar mi reseña
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </article>
    </main>
  );
}

export default DetalleLibro;
