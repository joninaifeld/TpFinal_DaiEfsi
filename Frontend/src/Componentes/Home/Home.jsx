import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { getEstadisticas, getActividad, getLibros } from "../../services/userService.js";
import { getColecciones } from "../../services/collectionService.js";
import { buscarLibros, setEstado } from "../../services/bookService.js";
import TarjetaLibro from "../TarjetaLibro/TarjetaLibro";
import BotonAgregar from "../BotonAgregar/BotonAgregar";
import "./Home.css";

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [actividad, setActividad] = useState([]);
  const [colecciones, setColecciones] = useState([]);
  const [novedades, setNovedades] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const [statsData, actividadData, coleccionesData, novedadesData, favData] = await Promise.allSettled([
        getEstadisticas(),
        getActividad(5),
        getColecciones(),
        buscarLibros('libros', 1),
        getLibros({ favoritos: 'true' }),
      ]);

      if (statsData.status === 'fulfilled') setStats(statsData.value);
      if (actividadData.status === 'fulfilled') setActividad(actividadData.value);
      if (coleccionesData.status === 'fulfilled') setColecciones(coleccionesData.value);
      if (novedadesData.status === 'fulfilled') setNovedades(novedadesData.value.resultados?.slice(0, 6) ?? []);
      if (favData.status === 'fulfilled') setFavoritos(favData.value.slice(0, 4));
      setCargando(false);
    }
    cargar();
  }, []);

  const retoCumplido = stats?.reading_challenge?.libros_leidos ?? 0;
  const retoTotal = stats?.reading_challenge?.objetivo_anual ?? 0;
  const retoPct = retoTotal > 0 ? Math.round((retoCumplido / retoTotal) * 100) : 0;

  if (cargando) return <div className="home"><p className="home__cargando">Cargando...</p></div>;

  return (
    <div className="home">
      <section className="home__banda_superior">
        <div className="home__saludo">
          <p className="home__saludo_nombre">Hola, {user?.username ?? ''}.</p>
          <p className="home__saludo_sub">Continuá la lectura</p>
        </div>

        <div className="home__widgets">
          <div className="home__widget_reto">
            <p className="home__reto_titulo">Reto de lectura 2026</p>
            <p className="home__reto_progreso">
              {retoCumplido} de {retoTotal} libros
            </p>
            <div className="home__reto_barra_fondo">
              <div
                className="home__reto_barra_fill"
                style={{ width: `${retoPct}%` }}
              />
            </div>
            <p className="home__reto_pct">{retoPct}% completado</p>
          </div>
        </div>
      </section>

      <div className="home__contenido">
        {novedades.length > 0 && (
          <section className="home__seccion">
            <h2 className="home__seccion_titulo">Novedades y destacados</h2>
            <div className="home__libros_contenedor">
              {novedades.map((libro, i) => (
                <div key={libro.openlibrary_key ?? i} className="home__libro_item">
                  <TarjetaLibro
                    libro={{ titulo: libro.titulo, portada: libro.cover_url || null }}
                    onVer={() => navigate(`/libro/${libro.openlibrary_key}`)}
                  />
                  <BotonAgregar
                    onAgregar={() => setEstado(libro.openlibrary_key, 'Quiero leer')}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {favoritos.length > 0 && (
          <section className="home__seccion">
            <h2 className="home__seccion_titulo">Tus favoritos</h2>
            <div className="home__libros_contenedor">
              {favoritos.map((libro) => (
                <div key={libro.openlibrary_key ?? libro.id} className="home__libro_item">
                  <TarjetaLibro
                    libro={{ titulo: libro.titulo, portada: libro.cover_url || null }}
                    onVer={() => navigate(`/libro/${libro.openlibrary_key}`)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {actividad.length > 0 && (
          <section className="home__seccion">
            <h2 className="home__seccion_titulo">Actividad reciente</h2>
            <div className="home__libros_contenedor">
              {actividad.map((item) => (
                <div key={item.id} className="home__libro_item">
                  <p className="home__actividad_texto">{item.descripcion}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {colecciones.length > 0 && (
          <section className="home__seccion">
            <h2 className="home__seccion_titulo">Tus colecciones</h2>
            <div className="home__libros_contenedor">
              {colecciones.map((col) => (
                <div
                  key={col.id}
                  className="home__coleccion_card"
                  onClick={() => navigate(`/coleccion/${col.id}`)}
                >
                  <p className="home__coleccion_nombre">{col.nombre}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Home;
