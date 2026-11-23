import { useState } from "react";
import { buscarLibros, setEstado, setFavorito } from "../../services/bookService.js";
import BotonFavorito from "../BotonFavorito/BotonFavorito";
import BotonAgregar from "../BotonAgregar/BotonAgregar";
import "./Explorar.css";

const ORDENES = [
  { valor: "relevancia", texto: "Ordenar por relevancia" },
  { valor: "titulo", texto: "Título (A-Z)" },
];

const POR_PAGINA = 8;

function TarjetaExplorar({ libro, onAgregar, onAgregado, onFavorito }) {
  const { titulo, autor, cover_url, genero_principal } = libro;

  return (
    <article className="explorar-card">
      <div
        className="explorar-card__portada"
        style={cover_url ? { backgroundImage: `url(${cover_url})` } : undefined}
      >
        {!cover_url && <span>Libro</span>}
      </div>

      <div className="explorar-card__info">
        {genero_principal && <span className="explorar-card__genero">{genero_principal}</span>}
        <h3 className="explorar-card__titulo">{titulo}</h3>
        {autor && <p className="explorar-card__autor">{autor}</p>}

        <div className="explorar-card__acciones">
          <BotonAgregar onAgregar={onAgregar} onAgregado={onAgregado} />
          <BotonFavorito onChange={onFavorito} />
        </div>
      </div>
    </article>
  );
}

function Explorar() {
  const [texto, setTexto] = useState("");
  const [libros, setLibros] = useState([]);
  const [total, setTotal] = useState(0);
  const [orden, setOrden] = useState("relevancia");
  const [pagina, setPagina] = useState(1);
  const [buscando, setBuscando] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [error, setError] = useState('');
  const [agregados, setAgregados] = useState([]);

  const buscar = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    setError('');
    setBuscando(true);
    try {
      const data = await buscarLibros(texto.trim(), 1);
      setLibros(data.resultados ?? []);
      setTotal(data.total ?? 0);
      setPagina(1);
      setBuscado(true);
    } catch {
      setError('No se pudo realizar la búsqueda. Intentá de nuevo.');
    } finally {
      setBuscando(false);
    }
  };

  const agregarABiblioteca = async (libro) => {
    try {
      await setEstado(libro.openlibrary_key, 'Quiero leer');
    } catch {}
  };

  const quitarDeResultados = (libro) => {
    setAgregados((prev) => [...prev, libro.openlibrary_key]);
  };

  const toggleFavorito = async (libro, esFavorito) => {
    try {
      await setFavorito(libro.openlibrary_key, esFavorito);
    } catch {}
  };

  const visibles = libros.filter((l) => !agregados.includes(l.openlibrary_key));

  const ordenados = orden === "titulo"
    ? [...visibles].sort((a, b) => a.titulo.localeCompare(b.titulo))
    : visibles;

  const totalPaginas = Math.max(1, Math.ceil(ordenados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * POR_PAGINA;
  const librosPagina = ordenados.slice(inicio, inicio + POR_PAGINA);

  return (
    <section className="explorar">
      <header className="explorar__encabezado">
        <h1 className="explorar__titulo">Explora nuevos libros</h1>
        <p className="explorar__subtitulo">
          Encontrá tu próxima lectura entre miles de historias.
        </p>
      </header>

      <form className="explorar__buscador" onSubmit={buscar} role="search">
        <div className="explorar__buscador_campo">
          <svg className="explorar__buscador_icono" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            className="explorar__input"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            aria-label="Buscar libros por título o autor"
          />
        </div>
        <button type="submit" className="explorar__btn-buscar" disabled={buscando}>
          {buscando ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      <div className="explorar__filtros">
        <div className="explorar__selects">
          <select
            className="explorar__select explorar__select--orden"
            value={orden}
            onChange={(e) => { setOrden(e.target.value); setPagina(1); }}
            aria-label="Ordenar resultados"
          >
            {ORDENES.map((o) => (
              <option key={o.valor} value={o.valor}>{o.texto}</option>
            ))}
          </select>
        </div>

        {buscado && (
          <p className="explorar__estado">
            {total} resultados para "{texto}"
          </p>
        )}
      </div>

      {error && <p className="explorar__error">{error}</p>}

      {buscado && (
        <h2 className="explorar__subtitulo-seccion">Resultados</h2>
      )}

      {librosPagina.length === 0 && buscado ? (
        <p className="explorar__vacio">
          No encontramos libros con esa búsqueda. Probá con otro término.
        </p>
      ) : (
        <div className="explorar__grilla">
          {librosPagina.map((libro) => (
            <TarjetaExplorar
              key={libro.openlibrary_key}
              libro={libro}
              onAgregar={() => agregarABiblioteca(libro)}
              onAgregado={() => quitarDeResultados(libro)}
              onFavorito={(val) => toggleFavorito(libro, val)}
            />
          ))}
        </div>
      )}

      {totalPaginas > 1 && (
        <nav className="explorar__paginacion" aria-label="Paginación">
          <button
            type="button"
            className="explorar__pag-btn"
            onClick={() => setPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            aria-label="Página anterior"
          >
            &lt;
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              type="button"
              className={`explorar__pag-btn ${num === paginaActual ? "explorar__pag-btn--activa" : ""}`}
              onClick={() => setPagina(num)}
              aria-current={num === paginaActual ? "page" : undefined}
            >
              {num}
            </button>
          ))}

          <button
            type="button"
            className="explorar__pag-btn"
            onClick={() => setPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            aria-label="Página siguiente"
          >
            &gt;
          </button>
        </nav>
      )}
    </section>
  );
}

export default Explorar;
