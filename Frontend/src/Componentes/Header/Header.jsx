import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FotoPerfil from "../FotoPerfil/FotoPerfil";
import logo from "../../assets/LogoNegro.png";
import "./Header.css";

const SECCIONES = [
  { ruta: "/", texto: "Home" },
  { ruta: "/explorar", texto: "Explorar" },
  { ruta: "/biblioteca", texto: "Biblioteca" },
  { ruta: "/estadisticas", texto: "Estadísticas" },
];

const DURACION_BARRA = 670;

function Header({ fotoPerfil }) {
  const { pathname } = useLocation();
  const headerRef = useRef(null);
  const [barra, setBarra] = useState({ left: 0, width: 0, visible: false, animar: false });

  const [seleccionado, setSeleccionado] = useState(pathname);

  useEffect(() => {
    const espera = setTimeout(() => setSeleccionado(pathname), DURACION_BARRA);
    return () => clearTimeout(espera);
  }, [pathname]);

  const medir = useCallback(() => {
    const header = headerRef.current;
    const destino = header?.querySelector(`[data-ruta="${pathname}"]`);
    if (!destino) {
      setBarra((prev) => ({ ...prev, visible: false }));
      return;
    }
    const posHeader = header.getBoundingClientRect();
    const posDestino = destino.getBoundingClientRect();
    setBarra((prev) => ({
      left: posDestino.left - posHeader.left,
      width: posDestino.width,
      visible: true,
      animar: prev.visible, 
    }));
  }, [pathname]);

  useLayoutEffect(() => {
    medir();
  }, [medir]);

  useEffect(() => {
    window.addEventListener("resize", medir);
    document.fonts?.ready.then(medir);
    return () => window.removeEventListener("resize", medir);
  }, [medir]);

  return (
    <header className="header" ref={headerRef}>
      <Link to="/" className="header__logo">
        <img src={logo} alt="My Collection - Librería web y colecciones" />
      </Link>

      <nav className="header__nav">
        {SECCIONES.map(({ ruta, texto }) => (
          <Link
            key={ruta}
            to={ruta}
            data-ruta={ruta}
            className={
              seleccionado === ruta ? "header__link header__link--activo" : "header__link"
            }
          >
            {texto}
          </Link>
        ))}
      </nav>

      <div className="header__perfil" data-ruta="/perfil">
        <FotoPerfil foto={fotoPerfil} activo={seleccionado === "/perfil"} />
      </div>

      {/* Barra dorada que se desliza por debajo de todo el header */}
      <span
        className={`header__barra ${barra.animar ? "header__barra--animada" : ""}`}
        style={{
          transform: `translateX(${barra.left}px)`,
          width: `${barra.width}px`,
          opacity: barra.visible ? 1 : 0,
        }}
      />
    </header>
  );
}

export default Header;