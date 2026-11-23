import "./perfil.css";
import fotoPerfil from "../../assets/FotoPerfilPrueba.png";
import TarjetaLibro from "../TarjetaLibro/TarjetaLibro";
import Resenia from "../Resenia/Resenia";
import { useNavigate } from "react-router-dom"; 

function Perfil({
  
  nombreCompleto = "nombre completo",
  biografia = "biografía",
  generoPreferido = "genero preferido:",
  foto = fotoPerfil,
  favoritos = [],
  actividad = [],
  resenias = [],
  onEditarBiografia,
})

{

  const verLibro = (libro) => navigate(`/libro/${libro.id}`);

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
              {favoritos.map((libro) => (
      <TarjetaLibro key={libro.id} libro={libro} onVer={verLibro} />
    ))}
          </div>
        </section>

        <section className="seccion">
          <h2 className="seccion__titulo">Actividad</h2>
          <div className="seccion__fila">
        {actividad.map((libro) => (
      <TarjetaLibro key={libro.id} libro={libro} onVer={verLibro} />
    ))}
          </div>
        </section>

        <section className="seccion seccion--resenias">
          <h2 className="seccion__titulo">Reseñas</h2>
          <div className="seccion__fila">
            {resenias.map((r) => (
              <Resenia key={r.id} resenia={r} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Perfil;