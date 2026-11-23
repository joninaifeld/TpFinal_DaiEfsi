import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { login } from '../../services/authService.js';
import './Login.css';
import logoNegro from '../../assets/LogoNegro.png';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login: loginCtx } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Completá usuario y contraseña.');
      return;
    }
    setError('');
    setCargando(true);
    try {
      const data = await login(username.trim(), password);
      loginCtx(data);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al iniciar sesión.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login_page">
      <img src={logoNegro} alt="My Collection - Librería Web & Colecciones" className="login_logo" />
      <div className="login_card">
        <form onSubmit={handleSubmit} className="login_form">
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login_input"
          />
          <input
            type="password"
            placeholder="contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login_input"
          />
          {error && <p className="login_error">{error}</p>}
          <button type="submit" className="login_button" disabled={cargando}>
            {cargando ? 'Entrando...' : 'Iniciar Sesión'}
          </button>
          <Link to="/registro" className="login_registro">
            ¿No tenés cuenta?
          </Link>
        </form>
      </div>
    </div>
  );
}
