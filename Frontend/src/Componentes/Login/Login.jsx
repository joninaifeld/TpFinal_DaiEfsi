import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import logoNegro from '../../assets/LogoNegro.png';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // CONECTAR CON BACKEND
    };
    // temportalmente manda a home sin importar que completes para poder desarrollar bien, dsps cambiamos
    const irHome = () => {
        navigate('/home');
    };

    return (
        <div className="login_page">
            <img src={logoNegro} alt="My Collection - Librería Web & Colecciones" className="login_logo" />
            <div className="login_card">
                <form onSubmit={handleSubmit} className="login_form">
                    <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} className="login_input" />
                    <input type="password" placeholder="contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="login_input" />
                    <button type="button" className="login_button" onClick={irHome}>
                        Iniciar Sesión
                    </button>
                    <Link to="/registro" className="login_registro">
                        ¿No tenés cuenta?
                    </Link>
                </form>
            </div>
        </div>
    )
}