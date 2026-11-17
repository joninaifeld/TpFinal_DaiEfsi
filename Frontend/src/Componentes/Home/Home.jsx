import TarjetaLibro from "../TarjetaLibro/TarjetaLibro";
import BotonAgregar from "../BotonAgregar/BotonAgregar";
import libroPlaceholder from "../../assets/LibroPlaceholder.png";
import "./Home.css";

const LIBRO_LEYENDO = {
  titulo: "PLACEHOLDER",
  autor: "PLACEHOLDER",
  portada: libroPlaceholder,
};

const LIBROS_NOVEDADES = [
  { id: 1, titulo: "PLACEHOLDER", portada: libroPlaceholder, rating: 4 },
  { id: 2, titulo: "PLACEHOLDER", portada: libroPlaceholder, rating: 3.5 },
  { id: 3, titulo: "PLACEHOLDER", portada: libroPlaceholder, rating: 0 },
  { id: 4, titulo: "PLACEHOLDER", portada: libroPlaceholder, rating: 0 },
  { id: 5, titulo: "PLACEHOLDER", portada: libroPlaceholder, rating: 0 },
  { id: 6, titulo: "PLACEHOLDER", portada: libroPlaceholder, rating: 0 },
];

const LIBROS_FAVORITOS = [
  { id: 1, titulo: "PLACEHOLDER", portada: libroPlaceholder },
  { id: 2, titulo: "PLACEHOLDER", portada: libroPlaceholder },
  { id: 3, titulo: "PLACEHOLDER", portada: libroPlaceholder },
  { id: 4, titulo: "PLACEHOLDER", portada: libroPlaceholder },
];

const ACTIVIDAD_RECIENTE = [
  { id: 1, texto: "PLACEHOLDER" },
  { id: 2, texto: "PLACEHOLDER" },
];

const COLECCIONES = [
  {
    id: 1,
    nombre: "PLACEHOLDER",
    libros: [libroPlaceholder, libroPlaceholder],
  },
];

const RETO_ACTUAL = 20;
const RETO_COMPLETADO = 12;

function MiniPortada({ portada }) {
  return (
    <div
      className="mini_portada"
      style={{ backgroundImage: `url(${portada})` }}
    />
  );
}

function Home() {
  return (
    <div className="home">
      <section className="home__saludo">
        <p className="home__saludo_nombre">Hola, PLACEHOLDER.</p>
        <p className="home__saludo_sub">Continuá su lectura</p>
      </section>

      <section className="home__widgets">
        <div className="home__widget_reto">
          <p className="home__reto_titulo">Reto de lectura 2026</p>
          <p className="home__reto_progreso">
            {RETO_COMPLETADO} de {RETO_ACTUAL} libros
          </p>
          <div className="home__reto_barra_fondo">
            <div
              className="home__reto_barra_fill"
              style={{ width: `${(RETO_COMPLETADO / RETO_ACTUAL) * 100}%` }}
            />
          </div>
        </div>

        <div className="home__widget_leyendo">
          <p className="home__leyendo_label">Leyendo actualmente</p>
          <div className="home__leyendo_contenido">
            <div
              className="home__leyendo_portada"
              style={{ backgroundImage: `url(${LIBRO_LEYENDO.portada})` }}
            />
            <div className="home__leyendo_info">
              <p className="home__leyendo_titulo">{LIBRO_LEYENDO.titulo}</p>
              <p className="home__leyendo_autor">{LIBRO_LEYENDO.autor}</p>
              <span className="home__leyendo_badge">Leyendo</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home__seccion">
        <h2 className="home__seccion_titulo">Novedades y destacados</h2>
        <div className="home__novedades_grilla">
          {LIBROS_NOVEDADES.map((libro) => (
            <div key={libro.id} className="home__novedades_item">
              <TarjetaLibro libro={libro} />
              <BotonAgregar />
            </div>
          ))}
        </div>
      </section>

      <div className="home__columna_lateral">
        <section className="home__seccion home__seccion_favoritos">
          <h2 className="home__seccion_titulo">Tus favoritos recientes</h2>
          <div className="home__favoritos_fila">
            {LIBROS_FAVORITOS.map((libro) => (
              <div key={libro.id} className="home__favorito_item">
                <MiniPortada portada={libro.portada} />
                <p className="home__favorito_nombre">{libro.titulo}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="home__seccion home__seccion_actividad">
          <h2 className="home__seccion_titulo">Actividad reciente</h2>
          <ul className="home__actividad_lista">
            {ACTIVIDAD_RECIENTE.map((item) => (
              <li key={item.id} className="home__actividad_item">
                {item.texto}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="home__seccion">
        <h2 className="home__seccion_titulo">Tus colecciones</h2>
        <div className="home__colecciones_fila">
          {COLECCIONES.map((col) => (
            <div key={col.id} className="home__coleccion_card">
              <div className="home__coleccion_portadas">
                {col.libros.map((portada, i) => (
                  <MiniPortada key={i} portada={portada} />
                ))}
              </div>
              <p className="home__coleccion_nombre">{col.nombre}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
