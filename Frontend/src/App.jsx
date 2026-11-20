import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./Componentes/Header/Header.jsx";
import Footer from "./Componentes/Footer/Footer.jsx";
import Login from "./Componentes/Login/Login.jsx";
import Registro from "./Componentes/Registro/Registro.jsx";
import Explorar from "./Componentes/Explorar/Explorar.jsx";
import fotoPrueba from "./assets/FotoPerfilprueba.png";
import Perfil from "./Componentes/Perfil/Perfil";
import Home from "./Componentes/Home/Home.jsx";
import Estadisticas from "./Componentes/Estadisticas/Estadisticas.jsx";

import {
  favoritosPrueba,
  actividadPrueba,
  reseniasPrueba,
} from "./Componentes/datosPrueba";
import "./App.css";

function AppContent(){
  const location = useLocation();
  const ocultarHeader = ["/login", "/registro"].includes(location.pathname);

  return (
    <>
      {!ocultarHeader && <Header fotoPerfil={fotoPrueba} />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/home" element={<Home />} />
          <Route path="/explorar" element={<Explorar />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
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