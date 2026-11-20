import "./Estadisticas.css";

const STATS = {
  estados: {
    "Quiero leer": 3,
    Leyendo: 1,
    "Leído": 6,
    Abandonado: 0,
  },
  total_favoritos: 5,
  total_interacciones: 10,
  colecciones: {
    total_colecciones: 3,
    libros_en_colecciones: 8,
  },
  generos_mas_frecuentes: [
    { genero: "Science fiction", cantidad: 4 },
    { genero: "Fantasy", cantidad: 3 },
    { genero: "Drama", cantidad: 2 },
    { genero: "Terror", cantidad: 2 },
    { genero: "Historia", cantidad: 1 },
  ],
  valoraciones: {
    total_valoraciones: 5,
    total_resenas: 3,
    puntuacion_promedio: 4.4,
  },
};

function TarjetaStat({ titulo, children, className }) {
  return (
    <div className={`stat_card${className ? " " + className : ""}`}>
      <p className="stat_card__titulo">{titulo}</p>
      {children}
    </div>
  );
}

function Estadisticas() {
  const { estados, total_favoritos, total_interacciones, colecciones, generos_mas_frecuentes, valoraciones } = STATS;
  const maxGenero = generos_mas_frecuentes[0]?.cantidad ?? 1;

  return (
    <div className="estadisticas">
      <h1 className="estadisticas__titulo">Mis estadísticas</h1>

      <div className="estadisticas__fila">

        <TarjetaStat titulo="Mi biblioteca">
          <ul className="stat_estados">
            {Object.entries(estados).map(([estado, cantidad]) => (
              <li key={estado} className="stat_estados__fila">
                <span className="stat_estados__nombre">{estado}</span>
                <span className="stat_estados__cantidad">{cantidad}</span>
              </li>
            ))}
          </ul>
        </TarjetaStat>

        <TarjetaStat titulo="Géneros más frecuentes">
          <ul className="stat_generos">
            {generos_mas_frecuentes.map(({ genero, cantidad }) => (
              <li key={genero} className="stat_generos__fila">
                <span className="stat_generos__nombre">{genero}</span>
                <div className="stat_generos__barra_fondo">
                  <div
                    className="stat_generos__barra_fill"
                    style={{ width: `${(cantidad / maxGenero) * 100}%` }}
                  />
                </div>
                <span className="stat_generos__cantidad">{cantidad}</span>
              </li>
            ))}
          </ul>
        </TarjetaStat>

        <TarjetaStat titulo="Colecciones">
          <p className="stat_numero">{colecciones.total_colecciones}</p>
          <p className="stat_label">colecciones creadas</p>
          <div className="stat_separador" />
          <p className="stat_numero stat_numero--medio">{colecciones.libros_en_colecciones}</p>
          <p className="stat_label">libros en colecciones</p>
        </TarjetaStat>

      </div>

      <div className="estadisticas__fila">

        <TarjetaStat titulo="Libros guardados">
          <p className="stat_numero">{total_interacciones}</p>
          <p className="stat_label">en favoritos o con estado</p>
        </TarjetaStat>

        <TarjetaStat titulo="Favoritos">
          <p className="stat_numero">{total_favoritos}</p>
          <p className="stat_label">libros marcados</p>
        </TarjetaStat>

        <TarjetaStat titulo="Valoraciones">
          <div className="stat_valoraciones_contenido">
            <div className="stat_valoraciones_principal">
              <p className="stat_numero stat_numero--grande">
                {valoraciones.puntuacion_promedio.toFixed(1)}
                <span className="stat_numero__suffix"> / 5</span>
              </p>
              <p className="stat_label">puntuación promedio</p>
            </div>
            <div className="stat_separador_v" />
            <div className="stat_valoraciones_detalle">
              <div>
                <p className="stat_numero stat_numero--medio">{valoraciones.total_valoraciones}</p>
                <p className="stat_label">valoraciones</p>
              </div>
              <div>
                <p className="stat_numero stat_numero--medio">{valoraciones.total_resenas}</p>
                <p className="stat_label">reseñas escritas</p>
              </div>
            </div>
          </div>
        </TarjetaStat>

      </div>
    </div>
  );
}

export default Estadisticas;
