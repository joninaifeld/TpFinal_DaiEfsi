import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLibros } from "../../services/userService.js";
import { setFavorito } from "../../services/bookService.js";
import { getColecciones, crearColeccion, eliminarColeccion } from "../../services/collectionService.js";
import BuscadorColecciones from "../Buscador/BuscadorColecciones";
import TarjetaColeccion from "../TarjetaColeccion/TarjetaColeccion";
import ColeccionLibroCard from "../ColeccionLibroCard/ColeccionLibroCard";
import "./Biblioteca.css";

const ESTADOS = ['Todos', 'Quiero leer', 'Leyendo', 'Leído', 'Abandonado'];

const normalizar = (t = "") =>
  t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

function Biblioteca() {
  const navigate = useNavigate();
  const [libros, setLibros] = useState([]);
  const [colecciones, setColecciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [busquedaLibros, setBusquedaLibros] = useState('');

  const [textoCol, setTextoCol] = useState("");
  const [orden_alfa, setOrdenAlfa] = useState("");
  const [orden_fecha, setOrdenFecha] = useState("");
  const [nuevaColeccion, setNuevaColeccion] = useState("");
  const [errorCrear, setErrorCrear] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        const [librosRes, coleccionesRes] = await Promise.allSettled([
          getLibros(),
          getColecciones(),
        ]);
        if (librosRes.status === 'fulfilled') setLibros(librosRes.value);
        if (coleccionesRes.status === 'fulfilled') setColecciones(coleccionesRes.value.map((c) => ({
          ...c,
          cantidadLibros: c.cantidad_libros ?? 0,
          actualizadoEn: c.created_at,
        })));
      } catch {
        setError('No se pudieron cargar los datos.');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  const librosFiltrados = useMemo(() => {
    let resultado = libros;
    if (filtroEstado !== 'Todos') {
      resultado = resultado.filter((l) => l.estado === filtroEstado);
    }
    if (soloFavoritos) {
      resultado = resultado.filter((l) => l.es_favorito);
    }
    if (busquedaLibros.trim()) {
      const q = normalizar(busquedaLibros);
      resultado = resultado.filter((l) => normalizar(l.titulo).includes(q));
    }
    return resultado;
  }, [libros, filtroEstado, soloFavoritos, busquedaLibros]);

  const coleccionesVisibles = useMemo(() => {
    const q = normalizar(textoCol);
    let resultado = q
      ? colecciones.filter((c) => normalizar(c.nombre).includes(q))
      : [...colecciones];

    if (orden_alfa) {
      resultado = [...resultado].sort((a, b) => {
        const cmp = normalizar(a.nombre).localeCompare(normalizar(b.nombre));
        return orden_alfa === "asc" ? cmp : -cmp;
      });
    } else if (orden_fecha) {
      resultado = [...resultado].sort((a, b) => {
        const diff = new Date(a.created_at) - new Date(b.created_at);
        return orden_fecha === "asc" ? diff : -diff;
      });
    }
    return resultado;
  }, [colecciones, textoCol, orden_alfa, orden_fecha]);

  const toggleFavorito = async (libro, val) => {
    try {
      await setFavorito(libro.openlibrary_key, val);
      setLibros((prev) => prev.map((l) =>
        l.openlibrary_key === libro.openlibrary_key ? { ...l, es_favorito: val } : l
      ));
    } catch {}
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!nuevaColeccion.trim()) return;
    setErrorCrear('');
    try {
      const res = await crearColeccion({ nombre: nuevaColeccion.trim() });
      const nueva = { ...res.coleccion, cantidadLibros: 0, actualizadoEn: res.coleccion.created_at };
      setColecciones((prev) => [...prev, nueva]);
      setNuevaColeccion('');
    } catch (err) {
      setErrorCrear(err.response?.data?.error || 'Error al crear la colección.');
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarColeccion(id);
      setColecciones((prev) => prev.filter((c) => c.id !== id));
    } catch {}
  };

  if (cargando) return <main className="biblioteca"><p className="biblioteca__vacio">Cargando...</p></main>;

  return (
    <main className="biblioteca">
      <h1 className="biblioteca__titulo">Mi biblioteca</h1>

      <section className="biblioteca__libros">
        <h2 className="biblioteca__seccion_titulo">Mis libros</h2>

        <div className="biblioteca__controles">
          <div className="biblioteca__buscador">
            <BuscadorColecciones valor={busquedaLibros} onCambio={setBusquedaLibros} placeholder="Buscar libro..." />
          </div>
          <div className="biblioteca__filtros">
            {ESTADOS.map((e) => (
              <button
                key={e}
                type="button"
                className={`biblioteca__estado_btn${filtroEstado === e ? ' biblioteca__estado_btn--activo' : ''}`}
                onClick={() => setFiltroEstado(e)}
              >
                {e}
              </button>
            ))}
            <button
              type="button"
              className={`biblioteca__estado_btn${soloFavoritos ? ' biblioteca__estado_btn--activo' : ''}`}
              onClick={() => setSoloFavoritos(!soloFavoritos)}
            >
              ★ Favoritos
            </button>
          </div>
        </div>

        {librosFiltrados.length === 0 ? (
          <p className="biblioteca__vacio">No tenés libros con esos filtros.</p>
        ) : (
          <div className="biblioteca__grilla">
            {librosFiltrados.map((libro) => (
              <ColeccionLibroCard
                key={libro.openlibrary_key ?? libro.id}
                libro={libro}
                onFavorito={(val) => toggleFavorito(libro, val)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="biblioteca__colecciones">
        <h2 className="biblioteca__seccion_titulo">Mis colecciones</h2>

        <form className="biblioteca__nueva" onSubmit={handleCrear}>
          <input
            type="text"
            className="biblioteca__nueva_input"
            placeholder="Nombre de nueva colección"
            value={nuevaColeccion}
            onChange={(e) => setNuevaColeccion(e.target.value)}
          />
          <button type="submit" className="biblioteca__nueva_btn">Crear</button>
          {errorCrear && <p className="biblioteca__error">{errorCrear}</p>}
        </form>

        <div className="biblioteca__controles">
          <div className="biblioteca__buscador">
            <BuscadorColecciones valor={textoCol} onCambio={setTextoCol} />
          </div>
          <div className="biblioteca__filtros">
            <select className="biblioteca__filtro_select" value={orden_alfa} onChange={(e) => { setOrdenAlfa(e.target.value); if (e.target.value) setOrdenFecha(""); }} aria-label="Ordenar alfabéticamente">
              <option value="">Alfabético</option>
              <option value="asc">A → Z</option>
              <option value="desc">Z → A</option>
            </select>
            <select className="biblioteca__filtro_select" value={orden_fecha} onChange={(e) => { setOrdenFecha(e.target.value); if (e.target.value) setOrdenAlfa(""); }} aria-label="Ordenar por fecha">
              <option value="">Fecha de creación</option>
              <option value="asc">Más antigua primero</option>
              <option value="desc">Más reciente primero</option>
            </select>
          </div>
        </div>

        {error && <p className="biblioteca__error">{error}</p>}

        <div className="biblioteca__grilla">
          {coleccionesVisibles.length === 0 ? (
            <p className="biblioteca__vacio">
              {textoCol ? "No se encontraron colecciones." : "Todavía no tenés colecciones."}
            </p>
          ) : (
            coleccionesVisibles.map((coleccion) => (
              <TarjetaColeccion
                key={coleccion.id}
                coleccion={coleccion}
                onVer={() => navigate(`/coleccion/${coleccion.id}`)}
                onEliminar={() => handleEliminar(coleccion.id)}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default Biblioteca;
