import { NavLink } from "react-router-dom";
import "./FotoPerfil.css";

function FotoPerfil({ foto, alt = "Foto de perfil" }) {
  return (
    <NavLink
      to="/perfil"
      aria-label="Ir a mi perfil"
      className={({ isActive }) =>
        isActive ? "foto-perfil foto-perfil--activo" : "foto-perfil"
      }
    >
      {foto && <img src={foto} alt={alt} className="foto-perfil__img" />}
    </NavLink>
  );
}

export default FotoPerfil;