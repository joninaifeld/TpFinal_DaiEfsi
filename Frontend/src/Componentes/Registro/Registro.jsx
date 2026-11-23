import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/authService.js';
import './Registro.css';
import logoNegro from '../../assets/LogoNegro.png';

export default function Registro() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Completá todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setError('');
    setCargando(true);
    try {
      await register(username.trim(), email.trim(), password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al registrarse.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro_page">
      <img src={logoNegro} alt="My Collection - Librería Web & Colecciones" className="registro_logo" />
      <div className="registro_card">
        <form onSubmit={handleSubmit} className="registro_form">
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="registro_input"
          />
          <input
            type="email"
            placeholder="correo electronico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="registro_input"
          />
          <input
            type="password"
            placeholder="contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="registro_input"
          />
          <input
            type="password"
            placeholder="confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="registro_input"
          />
          {error && <p className="registro_error">{error}</p>}
          <button type="submit" className="registro_button" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrarse'}
          </button>
          <Link to="/login" className="registro_login">
            ¿Ya tenés cuenta?
          </Link>
        </form>
      </div>
    </div>
  );
}
