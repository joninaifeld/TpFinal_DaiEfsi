import { Link } from "react-router-dom";
import "./FotoPerfil.css";

function FotoPerfil({ foto, activo = false, alt = "Foto de perfil" }) {
  return (
    <Link
      to="/perfil"
      aria-label="Ir a mi perfil"
      className={activo ? "foto-perfil foto-perfil--activo" : "foto-perfil"}
    >
      {foto && <img src={foto} alt={alt} className="foto-perfil__img" />}
    </Link>
  );
}

export default FotoPerfil;