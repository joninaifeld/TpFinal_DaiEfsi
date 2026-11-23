import "./CampoEtiquetas.css";

function CampoEtiquetas({ titulo, etiquetas = [] }) {
  const lista = Array.isArray(etiquetas) ? etiquetas : [etiquetas];

  return (
    <div className="campo-etiquetas">
      <span className="campo-etiquetas__label">{titulo}</span>
      <div className="campo-etiquetas__lista">
        {lista.length === 0 ? (
          <span className="campo-etiquetas__chip">—</span>
        ) : (
          lista.map((e, i) => (
            <span key={`${e}-${i}`} className="campo-etiquetas__chip">
              {e}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

export default CampoEtiquetas;