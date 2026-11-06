import './Perfil.css';
import fotoPerfil from "../assets/FotoPerfilprueba";

const favoritos = [
  { id: 1, nombre: 'Nombre', rating: 0 },
  { id: 2, nombre: 'Nombre', rating: 0 },
  { id: 3, nombre: 'Nombre', rating: 0 },
];

const actividad = [
  { id: 1, nombre: 'Nombre', rating: 0, estado: 'Leyendo', tipo: 'leyendo' },
  { id: 2, nombre: 'Nombre', rating: 0, estado: 'Leyendo', tipo: 'leyendo' },
  { id: 3, nombre: 'Nombre', rating: 0, estado: 'Recién terminado', tipo: 'terminado' },
  { id: 4, nombre: 'Nombre', rating: 0, estado: 'Recién abandonado', tipo: 'abandonado' },
];

const resenias = [
  { id: 1, libro: 'nombre libro', rating: 0, texto: 'lorem ipsum' },
  { id: 2, libro: 'nombre libro', rating: 0, texto: 'lorem ipsum' },
  { id: 3, libro: 'nombre libro', rating: 0, texto: 'lorem ipsum' },
];

function Estrellas({ valor = 0 }) {
  return (
    <div className="estrellas" aria-label={`${valor} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= valor ? 'estrella activa' : 'estrella'}>
          ★
        </span>
      ))}
    </div>
  );
}

function TarjetaLibro({ nombre, rating, estado, tipo }) {
  return (
    <article className="tarjeta-libro">
      <div className="portada">
        <span>Libro</span>
      </div>
      <p className="tarjeta-libro__nombre">{nombre}</p>
      <Estrellas valor={rating} />
      {estado && <span className={`estado estado--${tipo}`}>{estado}</span>}
    </article>
  );
}

export default function Perfil({
  nombreCompleto = 'nombre completo',
  biografia = 'biografía',
  generoPreferido = 'genero preferido:',
  foto = fotoPerfil,
  onEditarBiografia,
}) {
  return (
    <main className="perfil">
      <aside className="perfil__lateral">
        <img className="avatar" src={foto} alt="Foto de perfil" />

        <div className="campo campo--nombre">{nombreCompleto}</div>

        <div className="campo campo--bio">
          <span>{biografia}</span>
          <button
            type="button"
            className="campo__editar"
            aria-label="Editar biografía"
            onClick={onEditarBiografia}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6" />
              <path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        <div className="campo campo--genero">{generoPreferido}</div>
      </aside>

      <div className="perfil__contenido">
        <section className="seccion">
          <h2 className="seccion__titulo">Favoritos</h2>
          <div className="seccion__fila">
            {favoritos.map((l) => (
              <TarjetaLibro key={l.id} nombre={l.nombre} rating={l.rating} />
            ))}
          </div>
        </section>

        <section className="seccion">
          <h2 className="seccion__titulo">Actividad</h2>
          <div className="seccion__fila">
            {actividad.map((l) => (
              <TarjetaLibro key={l.id} nombre={l.nombre} rating={l.rating} estado={l.estado} tipo={l.tipo} />
            ))}
          </div>
        </section>

        <section className="seccion seccion--resenias">
          <h2 className="seccion__titulo">Reseñas</h2>
          <div className="seccion__fila">
            {resenias.map((r) => (
              <article key={r.id} className="resenia">
                <p className="resenia__libro">{r.libro}</p>
                <Estrellas valor={r.rating} />
                <p className="resenia__texto">{r.texto}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}