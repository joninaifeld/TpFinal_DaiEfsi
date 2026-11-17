import "./Estrellas.css";

function Estrellas({ valor = 0 }) {
  return (
    <div className="estrellas" aria-label={`${valor} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= valor ? "estrella activa" : "estrella"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default Estrellas;