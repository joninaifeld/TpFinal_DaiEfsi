import { tiempoRelativo } from "../TiempoRelativo";
import "./TarjetaColeccion.css";

/**
 * coleccion: {
 *   id, nombre, descripcion,
 *   portada?,          // URL de imagen
 *   cantidadLibros,    // número
 *   actualizadoEn?,    // fecha (ISO string, Date o timestamp)
 * }
 * onVer(coleccion): se llama al tocar "Ver colección"
 */
function TarjetaColeccion({ coleccion, onVer }) {
  const { nombre, descripcion, portada, cantidadLibros = 0, actualizadoEn } = coleccion;
  const actualizado = tiempoRelativo(actualizadoEn);

  return (
    <article className="tarjeta-coleccion">
      <div
        className="tarjeta-coleccion__portada"
        style={portada ? { backgroundImage: `url(${portada})` } : undefined}
        role={portada ? "img" : undefined}
        aria-label={portada ? `Portada de ${nombre}` : undefined}
      />

      <h2 className="tarjeta-coleccion__nombre">{nombre}</h2>
      <p className="tarjeta-coleccion__descripcion">{descripcion}</p>

      <div className="tarjeta-coleccion__datos">
        <span className="tarjeta-coleccion__dato">
          {cantidadLibros} {cantidadLibros === 1 ? "libro" : "libros"}
        </span>
        {actualizado && (
          <span className="tarjeta-coleccion__dato">actualizado {actualizado}</span>
        )}
      </div>

      <button
        type="button"
        className="tarjeta-coleccion__boton"
        onClick={() => onVer?.(coleccion)}
      >
        Ver colección
      </button>
    </article>
  );
}

export default TarjetaColeccion;