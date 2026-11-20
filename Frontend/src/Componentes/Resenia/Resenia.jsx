import Estrellas from "../Estrellas/Estrellas";
import "./Resenia.css";

/** resenia: { libro, rating, texto } */
function Resenia({ resenia }) {
  const { libro, rating = 0, texto } = resenia;

  return (
    <article className="resenia">
      <p className="resenia__libro">{libro}</p>
      <Estrellas valor={rating} />
      <p className="resenia__texto">{texto}</p>
    </article>
  );
}

export default Resenia;