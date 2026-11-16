import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./Componentes/Header/Header.jsx";
import Footer from "./Componentes/Footer/Footer.jsx";
import Login from "./Componentes/Login/Login.jsx";
import fotoPrueba from "./assets/FotoPerfilprueba.png";
import "./App.css";

function AppContent(){
  const location = useLocation();
  const ocultarHeader = location.pathname === "/login";

  return (
    <>
      {!ocultarHeader && <Header fotoPerfil={fotoPrueba} />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<p>Home</p>} />
          <Route path="/perfil" element={<p>Página de perfil</p>} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;