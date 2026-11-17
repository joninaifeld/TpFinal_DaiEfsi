import { useState } from "react";
import Estrellas from "../Estrellas/Estrellas";
import BotonFavorito from "../BotonFavorito/BotonFavorito";
import BotonAgregar from "../BotonAgregar/BotonAgregar";
import "./Explorar.css";

const GENEROS = ["Ficción", "Fantasía", "Misterio", "Historia"];
const IDIOMAS = ["Español", "Inglés"];
const RATINGS = [4.2, 4.5, 4.8, 4.0, 4.7];

const ORDENES = [
  { valor: "relevancia", texto: "Ordenar por relevancia" },
  { valor: "calificacion", texto: "Mejor calificados" },
  { valor: "titulo", texto: "Título (A-Z)" },
];

const POR_PAGINA = 8;

const LIBROS_PRUEBA = [];
let posGenero = 0;
let posIdioma = 0;
let posRating = 0;

for (let i = 1; i <= 40; i++) {
  LIBROS_PRUEBA.push({
    id: i,
    titulo: `Nombre libro ${i}`,
    autor: "Autor/a",
    portada: "",
    genero: GENEROS[posGenero],
    idioma: IDIOMAS[posIdioma],
    rating: RATINGS[posRating],
    votos: 100 + i * 10,
  });

  posGenero++;
  if (posGenero === GENEROS.length) posGenero = 0;

  posIdioma++;
  if (posIdioma === IDIOMAS.length) posIdioma = 0;

  posRating++;
  if (posRating === RATINGS.length) posRating = 0;
}

function TarjetaExplorar({ libro, onAgregar, onAgregado, onFavorito }) {
  const { titulo, autor, portada, rating = 0, votos = 0, genero } = libro;

  return (
    <article className="explorar-card">
      <div
        className="explorar-card__portada"
        style={portada ? { backgroundImage: `url(${portada})` } : undefined}
      >
        {!portada && <span>Libro</span>}
      </div>

      <div className="explorar-card__info">
        {genero && <span className="explorar-card__genero">{genero}</span>}
        <h3 className="explorar-card__titulo">{titulo}</h3>
        <p className="explorar-card__autor">{autor}</p>

        <div className="explorar-card__rating">
          <Estrellas valor={rating} />
          <span className="explorar-card__votos">
            {rating} ({votos})
          </span>
        </div>

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
  const [busqueda, setBusqueda] = useState("");
  const [genero, setGenero] = useState("");
  const [idioma, setIdioma] = useState("");
  const [orden, setOrden] = useState("relevancia");
  const [pagina, setPagina] = useState(1);
  const [agregados, setAgregados] = useState([]);

  const textoBuscado = busqueda.trim().toLowerCase();

  const resultados = LIBROS_PRUEBA.filter((libro) => {
    const yaAgregado = agregados.includes(libro.id);
    const coincideTexto =
      textoBuscado === "" ||
      libro.titulo.toLowerCase().includes(textoBuscado) ||
      libro.autor.toLowerCase().includes(textoBuscado);
    const coincideGenero = genero === "" || libro.genero === genero;
    const coincideIdioma = idioma === "" || libro.idioma === idioma;

    return !yaAgregado && coincideTexto && coincideGenero && coincideIdioma;
  });

  if (orden === "calificacion") {
    resultados.sort((a, b) => b.rating - a.rating);
  } else if (orden === "titulo") {
    resultados.sort((a, b) => a.titulo.localeCompare(b.titulo));
  }

  // 3. Calculamos la paginación
  const totalPaginas = Math.max(1, Math.ceil(resultados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * POR_PAGINA;
  const librosPagina = resultados.slice(inicio, inicio + POR_PAGINA);

  const paginas = [];
  for (let i = 1; i <= totalPaginas; i++) {
    paginas.push(i);
  }

  const buscar = (e) => {
    e.preventDefault();
    setBusqueda(texto);
    setPagina(1);
  };

  const elegirGenero = (nuevoGenero) => {
    setGenero(nuevoGenero);
    setPagina(1);
  };

  const agregarABiblioteca = async (libro) => {
    console.log("Agregado a biblioteca:", libro.id);
  };

  const quitarDeResultados = (libro) => {
    setAgregados([...agregados, libro.id]);
  };

  const toggleFavorito = (libro, esFavorito) => {
    console.log("Favorito:", libro.id, esFavorito);
  };

  return (
    <section className="explorar">
      <header className="explorar__encabezado">
        <h1 className="explorar__titulo">Explora nuevos libros</h1>
        <p className="explorar__subtitulo">
          Encontrá tu próxima lectura entre miles de historias.
        </p>
      </header>

      <form className="explorar__buscador" onSubmit={buscar} role="search">
        <input
          type="search"
          className="explorar__input"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          aria-label="Buscar libros por título o autor"
        />
        <button type="submit" className="explorar__btn-buscar">
          Buscar
        </button>
      </form>

      <div className="explorar__filtros">
        <div className="explorar__selects">
          <select
            className="explorar__select"
            value={genero}
            onChange={(e) => {
              setGenero(e.target.value);
              setPagina(1);
            }}
            aria-label="Filtrar por género"
          >
            <option value="">Género</option>
            {GENEROS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <select
            className="explorar__select"
            value={idioma}
            onChange={(e) => {
              setIdioma(e.target.value);
              setPagina(1);
            }}
            aria-label="Filtrar por idioma"
          >
            <option value="">Idioma</option>
            {IDIOMAS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>

          <select
            className="explorar__select explorar__select--orden"
            value={orden}
            onChange={(e) => {
              setOrden(e.target.value);
              setPagina(1);
            }}
            aria-label="Ordenar resultados"
          >
            {ORDENES.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.texto}
              </option>
            ))}
          </select>
        </div>

        <p className="explorar__estado">
          {busqueda
            ? `Mostrando resultados para “${busqueda}”`
            : "Mostrando resultados para tu búsqueda"}
        </p>
      </div>

      <div className="explorar__chips" role="group" aria-label="Categorías">
        <button
          type="button"
          className={`explorar__chip ${genero === "" ? "explorar__chip--activo" : ""}`}
          onClick={() => elegirGenero("")}
        >
          Todos
        </button>
        {GENEROS.map((g) => (
          <button
            key={g}
            type="button"
            className={`explorar__chip ${genero === g ? "explorar__chip--activo" : ""}`}
            onClick={() => elegirGenero(g)}
          >
            {g}
          </button>
        ))}
      </div>

      <h2 className="explorar__subtitulo-seccion">Resultados para explorar</h2>

      {librosPagina.length === 0 ? (
        <p className="explorar__vacio">
          No encontramos libros con esos filtros. Probá con otra búsqueda o
          quitá algún filtro.
        </p>
      ) : (
        <div className="explorar__grilla">
          {librosPagina.map((libro) => (
            <TarjetaExplorar
              key={libro.id}
              libro={libro}
              onAgregar={() => agregarABiblioteca(libro)}
              onAgregado={() => quitarDeResultados(libro)}
              onFavorito={(valor) => toggleFavorito(libro, valor)}
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

          {paginas.map((num) => (
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