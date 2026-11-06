import { BrowserRouter, Routes, Route } from "react-router-dom";
import FotoPerfil from "./Componentes/FotoPerfil/FotoPerfil";
import fotoPrueba from "./assets/FotoPerfilprueba.png";
import Footer from './Componentes/Footer/Footer';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "40px" }}>
        <FotoPerfil foto={fotoPrueba} />
      </div>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<p>Home</p>} />
          <Route path="/perfil" element={<p>Página de perfil</p>} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;