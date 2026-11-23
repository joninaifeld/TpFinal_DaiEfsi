import BotonFavorito from "../BotonFavorito/BotonFavorito";
import "./ColeccionLibroCard.css";

function ColeccionLibroCard({ libro, onFavorito, onQuitar }) {
  const { titulo, autor, cover_url, genero_principal, estado, es_favorito = false } = libro;

  return (
    <article className="coleccion_libro_card">
      <div
        className="coleccion_libro_card__portada"
        style={cover_url ? { backgroundImage: `url(${cover_url})` } : undefined}
      >
        {!cover_url && <span>Libro</span>}
      </div>

      <div className="coleccion_libro_card__info">
        {genero_principal && <span className="coleccion_libro_card__genero">{genero_principal}</span>}
        <h3 className="coleccion_libro_card__titulo">{titulo}</h3>
        <p className="coleccion_libro_card__autor">{autor}</p>

        <div className="coleccion_libro_card__acciones">
          {estado && (
            <span className="coleccion_libro_card__estado">{estado}</span>
          )}
          <BotonFavorito inicial={es_favorito} onChange={onFavorito} />
          {onQuitar && (
            <button type="button" className="coleccion_libro_card__quitar" onClick={onQuitar}>
              Quitar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default ColeccionLibroCard;
