import { useState } from "react";
import "./BotonFavorito.css";

function BotonFavorito({ inicial = false, activo, onChange, tamanio = 20 }) {
  const [esFavorito, setEsFavorito] = useState(activo || inicial);

  const manejarClick = () => {
    const nuevoEstado = !esFavorito;
    setEsFavorito(nuevoEstado);

    if (onChange) {
      onChange(nuevoEstado);
    }
  };

  let claseBoton = "boton-favorito";
  if (esFavorito) {
    claseBoton = "boton-favorito boton-favorito--activo";
  }

  return (
    <button
      type="button"
      className={claseBoton}
      onClick={manejarClick}
      aria-label={esFavorito ? "Quitar de favoritos" : "Marcar como favorito"}
    >
      <svg
        width={tamanio}
        height={tamanio}
        viewBox="0 0 24 24"
        className="boton-favorito__icono"
      >
        <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.6 4.5 6.3 4.5c2.1 0 3.6 1.1 4.5 2.6.3.5 1.1.5 1.4 0 .9-1.5 2.4-2.6 4.5-2.6 3.7 0 5.4 3.9 3.9 7.3C19.5 16.4 12 21 12 21z" />
      </svg>
    </button>
  );
}

export default BotonFavorito;