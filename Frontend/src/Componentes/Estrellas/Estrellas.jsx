import "./Estrellas.css";

function Estrellas({ valor = 0 }) {
  // Redondea al 0.5 más cercano: 4.3 -> 4.5, 4.2 -> 4, 4.8 -> 5
  const redondeado = Math.round(valor * 2) / 2;

  return (
    <div className="estrellas" aria-label={`${valor} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => {
        let clase = "estrella";
        if (n <= redondeado) clase += " activa";
        else if (n - 0.5 === redondeado) clase += " media";

        return (
          <span key={n} className={clase}>
            ★
          </span>
        );
      })}
    </div>
  );
}

export default Estrellas;