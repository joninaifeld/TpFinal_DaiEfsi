import CampoEtiquetas from "../CampoEtiquetas/CampoEtiquetas";
import "./DetalleLibro.css";

/**
 * libro: {
 *   id, titulo, portada?,
 *   rating, votos,
 *   generos: [], idiomas: [], autores: [],
 *   anioPublicacion, ediciones,
 *   descripcion
 * }
 * guardado:   true si el libro ya está guardado por el usuario
 * onGuardar(libro): se llama al tocar el ícono de guardar
 */
function DetalleLibro({ libro, guardado = false, onGuardar }) {
  if (!libro) return null;

  const {
    titulo,
    portada,
    rating,
    votos,
    generos,
    idiomas,
    autores,
    anioPublicacion,
    ediciones,
    descripcion,
  } = libro;

  return (
    <main className="detalle">
      <div className="detalle__portada-col">
        <div
          className="detalle__portada"
          style={portada ? { backgroundImage: `url(${portada})` } : undefined}
          role={portada ? "img" : undefined}
          aria-label={portada ? `Portada de ${titulo}` : undefined}
        >
          {!portada && <span>Libro</span>}
        </div>

        {rating != null && (
          <div className="detalle__puntuacion">
            <span className="detalle__estrella" aria-hidden="true">★</span>
            <span className="detalle__nota">{Number(rating).toFixed(1)}/10</span>
            {votos != null && <span className="detalle__votos">({votos})</span>}
          </div>
        )}
      </div>

      <article className="detalle__tarjeta">
        <button
          type="button"
          className={
            guardado
              ? "detalle__guardar detalle__guardar--activo"
              : "detalle__guardar"
          }
          aria-label={guardado ? "Quitar de guardados" : "Guardar libro"}
          aria-pressed={guardado}
          onClick={() => onGuardar?.(libro)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M5 3h11l4 4v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm2 2v5h9V5H7zm5 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
          </svg>
        </button>

        <h1 className="detalle__titulo">{titulo}</h1>

        <div className="detalle__campos">
          <CampoEtiquetas titulo="géneros" etiquetas={generos} />
          <CampoEtiquetas titulo="idiomas" etiquetas={idiomas} />
          <CampoEtiquetas titulo="Autor/es" etiquetas={autores} />
          <CampoEtiquetas titulo="año de publicación" etiquetas={anioPublicacion} />
          <CampoEtiquetas titulo="ediciones" etiquetas={ediciones} />
        </div>

        <p className="detalle__descripcion-label">Descripción</p>
        <div className="detalle__descripcion">{descripcion}</div>
      </article>
    </main>
  );
}

export default DetalleLibro;