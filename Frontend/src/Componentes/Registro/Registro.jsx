import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Registro.css';
import logoNegro from '../../assets/LogoNegro.png';

export default function Registro() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // CONECTAR CON BACKEND
    };

    // temporalmente manda a home sin importar que completes para poder desarrollar bien, dsps cambiamos
    const irHome = () => {
        navigate('/home');
    };

    return (
        <div className="registro_page">
            <img src={logoNegro} alt="My Collection - Librería Web & Colecciones" className="registro_logo" />
            <div className="registro_card">
                <form onSubmit={handleSubmit} className="registro_form">
                    <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} className="registro_input" />
                    <input type="email" placeholder="correo electronico" value={email} onChange={(e) => setEmail(e.target.value)} className="registro_input" />
                    <input type="password" placeholder="contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="registro_input" />
                    <input type="password" placeholder="confirmar contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="registro_input" />
                    <button type="button" className="registro_button" onClick={irHome}>
                        Registrarse
                    </button>
                    <Link to="/" className="registro_login">
                        ¿Ya tenés cuenta?
                    </Link>
                </form>
            </div>
        </div>
    )
}