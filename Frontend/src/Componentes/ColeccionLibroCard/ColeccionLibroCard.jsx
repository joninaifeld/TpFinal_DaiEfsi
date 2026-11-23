import Estrellas from "../Estrellas/Estrellas";
import BotonFavorito from "../BotonFavorito/BotonFavorito";
import "./ColeccionLibroCard.css";

const ETIQUETAS_ESTADO = {
  quiero_leer: "Quiero leer",
  leyendo: "Leyendo",
  leido: "Leído",
  abandonado: "Abandonado",
};

function ColeccionLibroCard({ libro, onFavorito }) {
  const { titulo, autor, portada, rating = 0, votos = 0, genero, estado, favorito = false } = libro;

  return (
    <article className="coleccion_libro_card">
      <div
        className="coleccion_libro_card__portada"
        style={portada ? { backgroundImage: `url(${portada})` } : undefined}
      >
        {!portada && <span>Libro</span>}
      </div>

      <div className="coleccion_libro_card__info">
        {genero && <span className="coleccion_libro_card__genero">{genero}</span>}
        <h3 className="coleccion_libro_card__titulo">{titulo}</h3>
        <p className="coleccion_libro_card__autor">{autor}</p>

        <div className="coleccion_libro_card__rating">
          <Estrellas valor={rating} />
          <span className="coleccion_libro_card__votos">
            {rating} ({votos})
          </span>
        </div>

        <div className="coleccion_libro_card__acciones">
          {estado && (
            <span className={`coleccion_libro_card__estado coleccion_libro_card__estado--${estado}`}>
              {ETIQUETAS_ESTADO[estado] ?? estado}
            </span>
          )}
          <BotonFavorito inicial={favorito} onChange={onFavorito} />
        </div>
      </div>
    </article>
  );
}

export default ColeccionLibroCard;
