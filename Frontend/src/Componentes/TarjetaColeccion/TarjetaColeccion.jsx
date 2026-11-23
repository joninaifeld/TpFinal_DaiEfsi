import { tiempoRelativo } from "../TiempoRelativo";
import "./TarjetaColeccion.css";

function TarjetaColeccion({ coleccion, onVer, onEliminar }) {
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

      {onEliminar && (
        <button
          type="button"
          className="tarjeta-coleccion__boton tarjeta-coleccion__boton--eliminar"
          onClick={() => onEliminar(coleccion)}
        >
          Eliminar
        </button>
      )}
    </article>
  );
}

export default TarjetaColeccion;
