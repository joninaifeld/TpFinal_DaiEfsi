import "./BuscadorColecciones.css";

function BuscadorColecciones({
  valor = "",
  onCambio,
  onBuscar,
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
    </form>
  );
}

export default BuscadorColecciones;