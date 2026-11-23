import Estrellas from "../Estrellas/Estrellas";
import "./TarjetaLibro.css";

const ETIQUETAS_ESTADO = {
  leyendo: "Leyendo",
  terminado: "Recién terminado",
  abandonado: "Recién abandonado",
};

/**
 * libro: { titulo, portada?, rating, estado? }
 */
function TarjetaLibro({ libro }) {
  const { titulo, portada, rating = 0, estado } = libro;

  return (
      <article
      className={clickeable ? "tarjeta-libro tarjeta-libro--clickeable" : "tarjeta-libro"}
      role={clickeable ? "button" : undefined}
      tabIndex={clickeable ? 0 : undefined}
      onClick={clickeable ? () => onVer(libro) : undefined}
      onKeyDown={
        clickeable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onVer(libro);
            }
          : undefined
      }
    >
      <p className="tarjeta_libro__nombre">{titulo}</p>
      <Estrellas valor={rating} />
      {estado && (
        <span className={`tarjeta_libro__estado tarjeta_libro__estado--${estado}`}>
          {ETIQUETAS_ESTADO[estado] ?? estado}
        </span>
      )}
    </article>
  );
}

export default TarjetaLibro;
