import { useMemo, useState } from "react";
import BuscadorColecciones from "../BuscadorColecciones/BuscadorColecciones";
import TarjetaColeccion from "../TarjetaColeccion/TarjetaColeccion";
import "./Biblioteca.css";

// Para buscar sin importar mayúsculas ni tildes
const normalizar = (t = "") =>
  t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

/**
 * Props:
 *  - colecciones: array que viene de tu base de datos (ver TarjetaColeccion)
 *  - cargando:    true mientras esperás la respuesta del backend
 *  - onVerColeccion(coleccion)
 *  - onFiltrar()
 *  - onBuscar(texto): opcional, si preferís buscar en el backend en vez de filtrar acá
 */
function Biblioteca({
  colecciones = [],
  cargando = false,
  onVerColeccion,
  onFiltrar,
  onBuscar,
}) {
  const [texto, setTexto] = useState("");

  const visibles = useMemo(() => {
    const q = normalizar(texto);
    if (!q) return colecciones;
    return colecciones.filter((c) => normalizar(c.nombre).includes(q));
  }, [colecciones, texto]);

  return (
    <main className="biblioteca">
      <h1 className="biblioteca__titulo">Mi biblioteca</h1>
      <p className="biblioteca__subtitulo">
        organiza tus libros en colecciones temáticas y personalizadas
      </p>

      <div className="biblioteca__buscador">
        <BuscadorColecciones
          valor={texto}
          onCambio={setTexto}
          onBuscar={onBuscar}
          onFiltrar={onFiltrar}
        />
      </div>

      <section className="biblioteca__grilla" aria-busy={cargando}>
        {cargando ? (
          <p className="biblioteca__vacio">Cargando colecciones…</p>
        ) : visibles.length === 0 ? (
          <p className="biblioteca__vacio">
            {texto ? "No se encontraron colecciones." : "Todavía no tenés colecciones."}
          </p>
        ) : (
          visibles.map((coleccion) => (
            <TarjetaColeccion
              key={coleccion.id}
              coleccion={coleccion}
              onVer={onVerColeccion}
            />
          ))
        )}
      </section>
    </main>
  );
}

export default Biblioteca;