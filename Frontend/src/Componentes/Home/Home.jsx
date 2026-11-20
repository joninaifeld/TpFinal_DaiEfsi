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
  { id: 1, titulo: "PLACEHOLDER", portada: libroPlaceholder, rating: 0 },
  { id: 2, titulo: "PLACEHOLDER", portada: libroPlaceholder, rating: 0 },
  { id: 3, titulo: "PLACEHOLDER", portada: libroPlaceholder, rating: 0 },
];

const COLECCIONES = [
  { id: 1, nombre: "PLACEHOLDER", portada: libroPlaceholder },
  { id: 2, nombre: "PLACEHOLDER", portada: libroPlaceholder },
  { id: 3, nombre: "PLACEHOLDER", portada: libroPlaceholder },
];

const RETO_ACTUAL = 20;
const RETO_COMPLETADO = 12;


function Home() {
  return (
    <div className="home">
      <section className="home__banda_superior">
        <div className="home__saludo">
          <p className="home__saludo_nombre">Hola, PLACEHOLDER.</p>
          <p className="home__saludo_sub">Continuá la lectura</p>
        </div>

        <div className="home__widgets">
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
        </div>
      </section>

      <div className="home__contenido">
        <section className="home__seccion">
          <h2 className="home__seccion_titulo">Novedades y destacados</h2>
          <div className="home__libros_contenedor">
            {LIBROS_NOVEDADES.map((libro) => (
              <div key={libro.id} className="home__libro_item">
                <TarjetaLibro libro={libro} />
                <BotonAgregar />
              </div>
            ))}
          </div>
        </section>

        <section className="home__seccion">
          <h2 className="home__seccion_titulo">Tus favoritos recientes</h2>
          <div className="home__libros_contenedor">
            {LIBROS_FAVORITOS.map((libro) => (
              <div key={libro.id} className="home__libro_item">
                <TarjetaLibro libro={libro} />
              </div>
            ))}
          </div>
        </section>

        <section className="home__seccion">
          <h2 className="home__seccion_titulo">Actividad reciente</h2>
          <div className="home__libros_contenedor">
            {ACTIVIDAD_RECIENTE.map((libro) => (
              <div key={libro.id} className="home__libro_item">
                <TarjetaLibro libro={libro} />
              </div>
            ))}
          </div>
        </section>

        <section className="home__seccion">
          <h2 className="home__seccion_titulo">Tus colecciones</h2>
          <div className="home__libros_contenedor">
            {COLECCIONES.map((col) => (
              <div key={col.id} className="home__coleccion_card">
                <div
                  className="home__coleccion_portada"
                  style={{ backgroundImage: `url(${col.portada})` }}
                />
                <p className="home__coleccion_nombre">{col.nombre}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
