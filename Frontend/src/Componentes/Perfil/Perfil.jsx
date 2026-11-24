import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPerfil, getLibros, getActividad, getResenas, updatePerfil } from "../../services/userService.js";
import "./perfil.css";
import TarjetaLibro from "../TarjetaLibro/TarjetaLibro";
import Resenia from "../Resenia/Resenia";

function Perfil() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [actividad, setActividad] = useState([]);
  const [resenias, setResenias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editandoBio, setEditandoBio] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [errorBio, setErrorBio] = useState('');
  const [editandoAvatar, setEditandoAvatar] = useState(false);
  const [avatarInput, setAvatarInput] = useState('');
  const [errorAvatar, setErrorAvatar] = useState('');

  useEffect(() => {
    async function cargar() {
      const [perfilRes, favRes, actRes, resenasRes] = await Promise.allSettled([
        getPerfil(),
        getLibros({ favoritos: 'true' }),
        getActividad(10),
        getResenas(),
      ]);
      if (perfilRes.status === 'fulfilled') {
        setPerfil(perfilRes.value);
        setBioInput(perfilRes.value.bio ?? '');
        setAvatarInput(perfilRes.value.avatar_url ?? '');
      }
      if (favRes.status === 'fulfilled') setFavoritos(favRes.value);
      if (actRes.status === 'fulfilled') setActividad(actRes.value);
      if (resenasRes.status === 'fulfilled') setResenias(resenasRes.value);
      setCargando(false);
    }
    cargar();
  }, []);

  const guardarBio = async () => {
    setErrorBio('');
    try {
      const res = await updatePerfil({ biografia: bioInput });
      setPerfil((prev) => ({ ...prev, bio: res.user?.bio ?? bioInput }));
      setEditandoBio(false);
    } catch (err) {
      setErrorBio(err.response?.data?.error || 'Error al guardar.');
    }
  };

  const guardarAvatar = async () => {
    setErrorAvatar('');
    try {
      const res = await updatePerfil({ foto_perfil: avatarInput.trim() || null });
      setPerfil((prev) => ({ ...prev, avatar_url: res.user?.avatar_url ?? avatarInput.trim() }));
      setEditandoAvatar(false);
    } catch (err) {
      setErrorAvatar(err.response?.data?.error || 'Error al guardar.');
    }
  };

  if (cargando) return <main className="perfil"><p>Cargando perfil...</p></main>;
  if (!perfil) return null;

  return (
    <main className="perfil">
      <aside className="perfil__lateral">
        {editandoAvatar ? (
          <div className="avatar_editar">
            <input
              type="url"
              className="avatar_input"
              placeholder="URL de la foto"
              value={avatarInput}
              onChange={(e) => setAvatarInput(e.target.value)}
            />
            {errorAvatar && <p className="campo__error">{errorAvatar}</p>}
            <button type="button" className="campo__guardar" onClick={guardarAvatar}>Guardar</button>
            <button type="button" className="campo__cancelar" onClick={() => setEditandoAvatar(false)}>Cancelar</button>
          </div>
        ) : (
          <div className="avatar_contenedor">
            {perfil.avatar_url ? (
              <img className="avatar" src={perfil.avatar_url} alt="Foto de perfil" />
            ) : (
              <div className="avatar avatar--placeholder">
                {perfil.username?.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              type="button"
              className="campo__editar avatar__editar"
              aria-label="Editar foto"
              onClick={() => setEditandoAvatar(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6" />
                <path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>
        )}

        <div className="campo campo--nombre">{perfil.username}</div>

        <div className="campo campo--bio">
          {editandoBio ? (
            <>
              <textarea
                className="campo__bio_input"
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                rows={3}
              />
              {errorBio && <p className="campo__error">{errorBio}</p>}
              <button type="button" className="campo__guardar" onClick={guardarBio}>Guardar</button>
              <button type="button" className="campo__cancelar" onClick={() => setEditandoBio(false)}>Cancelar</button>
            </>
          ) : (
            <>
              <span>{perfil.bio || 'Sin biografía.'}</span>
              <button
                type="button"
                className="campo__editar"
                aria-label="Editar biografía"
                onClick={() => setEditandoBio(true)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6" />
                  <path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </>
          )}
        </div>

        <div className="campo campo--genero">
          Objetivo anual: {perfil.reading_goal_annual || 0} libros
        </div>
      </aside>

      <div className="perfil__contenido">
        <section className="seccion">
          <h2 className="seccion__titulo">Favoritos</h2>
          <div className="seccion__fila">
            {favoritos.length === 0
              ? <p>No tenés favoritos todavía.</p>
              : favoritos.map((libro) => (
                <TarjetaLibro
                  key={libro.id ?? libro.openlibrary_key}
                  libro={{ titulo: libro.titulo, portada: libro.cover_url, rating: libro.puntuacion ?? 0 }}
                  onVer={() => navigate(`/libro/${libro.openlibrary_key}`)}
                />
              ))
            }
          </div>
        </section>

        <section className="seccion">
          <h2 className="seccion__titulo">Actividad</h2>
          <div className="seccion__fila">
            {actividad.length === 0
              ? <p>Sin actividad reciente.</p>
              : actividad.map((item) => (
                <p key={item.id} className="perfil__actividad_item">{item.descripcion}</p>
              ))
            }
          </div>
        </section>

        <section className="seccion seccion--resenias">
          <h2 className="seccion__titulo">Reseñas</h2>
          <div className="seccion__fila">
            {resenias.length === 0
              ? <p>No escribiste reseñas todavía.</p>
              : resenias.map((r) => (
                <Resenia
                  key={r.id}
                  resenia={{ libro: r.titulo, rating: r.puntuacion, texto: r.resena_texto }}
                />
              ))
            }
          </div>
        </section>
      </div>
    </main>
  );
}

export default Perfil;
