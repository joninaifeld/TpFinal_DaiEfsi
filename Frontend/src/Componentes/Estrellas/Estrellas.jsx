import "./Estrellas.css";

function Estrellas({ valor = 0 }) {
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