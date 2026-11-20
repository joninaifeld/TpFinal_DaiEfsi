import { useState } from "react";
import "./BotonAgregar.css";

function BotonAgregar({
  onAgregar,
  onAgregado,
  retardo = 1000,
  etiqueta = "Agregar a biblioteca",
  etiquetaAgregado = "Agregado",
}) {
  const [estado, setEstado] = useState("inicial");

  const manejarClick = async () => {
    if (estado !== "inicial") return;
    setEstado("cargando");

    try {
      if (onAgregar) {
        await onAgregar();
      }

      setEstado("agregado");

      setTimeout(() => {
        if (onAgregado) {
          onAgregado();
        }
      }, retardo);
    } catch (error) {
      console.error("No se pudo agregar a la biblioteca:", error);
      setEstado("inicial");
    }
  };

  if (estado === "agregado") {
    return (
      <button
        type="button"
        className="boton-agregar boton-agregar--agregado"
        disabled
      >
        {etiquetaAgregado}
        <span className="boton-agregar__tilde">✓</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className="boton-agregar"
      onClick={manejarClick}
      disabled={estado === "cargando"}
    >
      {etiqueta}
    </button>
  );
}

export default BotonAgregar;