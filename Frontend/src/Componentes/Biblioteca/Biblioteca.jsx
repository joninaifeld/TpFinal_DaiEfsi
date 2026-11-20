import { useMemo, useState } from "react";
import BuscadorColecciones from "../Buscador/BuscadorColecciones";
import TarjetaColeccion from "../TarjetaColeccion/TarjetaColeccion";
import "./Biblioteca.css";

const normalizar = (t = "") =>
  t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

function Biblioteca({
  colecciones = [],
  cargando = false,
  onVerColeccion,
  onBuscar,
}) {
  const [texto, setTexto] = useState("");
  const [orden_alfa, setOrdenAlfa] = useState(""); // "asc" | "desc" | ""
  const [orden_fecha, setOrdenFecha] = useState(""); // "asc" | "desc" | ""

  const visibles = useMemo(() => {
    const q = normalizar(texto);
    let resultado = q
      ? colecciones.filter((c) => normalizar(c.nombre).includes(q))
      : [...colecciones];

    if (orden_alfa) {
      resultado = [...resultado].sort((a, b) => {
        const cmp = normalizar(a.nombre).localeCompare(normalizar(b.nombre));
        return orden_alfa === "asc" ? cmp : -cmp;
      });
    } else if (orden_fecha) {
      resultado = [...resultado].sort((a, b) => {
        const diff = new Date(a.fechaCreacion) - new Date(b.fechaCreacion);
        return orden_fecha === "asc" ? diff : -diff;
      });
    }

    return resultado;
  }, [colecciones, texto, orden_alfa, orden_fecha]);

  const handleOrdenAlfa = (e) => {
    setOrdenAlfa(e.target.value);
    if (e.target.value) setOrdenFecha("");
  };

  const handleOrdenFecha = (e) => {
    setOrdenFecha(e.target.value);
    if (e.target.value) setOrdenAlfa("");
  };

  return (
    <main className="biblioteca">
      <h1 className="biblioteca__titulo">Mi biblioteca</h1>
      <p className="biblioteca__subtitulo">
        Organiza tus libros en colecciones temáticas y personalizadas
      </p>

      <div className="biblioteca__controles">
        <div className="biblioteca__buscador">
          <BuscadorColecciones
            valor={texto}
            onCambio={setTexto}
            onBuscar={onBuscar}
          />
        </div>

        <div className="biblioteca__filtros">
          <select
            className="biblioteca__filtro_select"
            value={orden_alfa}
            onChange={handleOrdenAlfa}
            aria-label="Ordenar alfabéticamente"
          >
            <option value="">Alfabético</option>
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>

          <select
            className="biblioteca__filtro_select"
            value={orden_fecha}
            onChange={handleOrdenFecha}
            aria-label="Ordenar por fecha de creación"
          >
            <option value="">Fecha de creación</option>
            <option value="asc">Más antigua primero</option>
            <option value="desc">Más reciente primero</option>
          </select>
        </div>
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
