import "./BuscadorColecciones.css";

/**
 * Buscador controlado: el padre guarda el texto.
 * Props:
 *  - valor, onCambio(texto)
 *  - onBuscar(texto)   (opcional, al apretar Enter; útil para buscar en el backend)
 *  - onFiltrar()       (opcional, botón de filtros)
 */
function BuscadorColecciones({
  valor = "",
  onCambio,
  onBuscar,
  onFiltrar,
  placeholder = "Escriba aquí el nombre de la colección",
}) {
  const manejarSubmit = (e) => {
    e.preventDefault();
    onBuscar?.(valor);
  };

  return (
    <form className="buscador" role="search" onSubmit={manejarSubmit}>
      <svg
        className="buscador__icono"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="10.5" cy="10.5" r="7" />
        <path d="M16 16l5 5" />
      </svg>

      <input
        className="buscador__input"
        type="search"
        value={valor}
        placeholder={placeholder}
        aria-label="Buscar colección"
        onChange={(e) => onCambio?.(e.target.value)}
      />

      <button
        type="button"
        className="buscador__filtro"
        aria-label="Filtrar colecciones"
        onClick={onFiltrar}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M3 6h18M6 12h12M10 18h4" />
        </svg>
      </button>
    </form>
  );
}

export default BuscadorColecciones;