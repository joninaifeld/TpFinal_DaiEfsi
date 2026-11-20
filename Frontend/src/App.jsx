import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import Header from "./Componentes/Header/Header.jsx";
import Footer from "./Componentes/Footer/Footer.jsx";
import Login from "./Componentes/Login/Login.jsx";
import Registro from "./Componentes/Registro/Registro.jsx";
import Explorar from "./Componentes/Explorar/Explorar.jsx";
import fotoPrueba from "./assets/FotoPerfilprueba.png";
import Perfil from "./Componentes/Perfil/Perfil";
import DetalleLibro from "./Componentes/DetalleLibro/DetalleLibro";
import {
  libroDetallePrueba,
  favoritosPrueba,
  actividadPrueba,      
  reseniasPrueba,
} from "./Componentes/datosPrueba";

import Biblioteca from "./Componentes/Biblioteca/Biblioteca";
import { coleccionesPrueba } from "./Componentes/datosbiblioteca.js";
import "./App.css";

function PaginaLibro() {
  const { id } = useParams();
  // Por ahora muestra el libro de prueba con el id que llegó en la URL.
  // Con la base de datos: fetch(`/api/libros/${id}`) y pasás el resultado.
  return <DetalleLibro libro={{ ...libroDetallePrueba, id: Number(id) }} />;
}

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
          <Route path="/explorar" element={<Explorar />} />
          <Route path="/libro/:id" element={<PaginaLibro />} />
          <Route path="/biblioteca" element={<Biblioteca colecciones={coleccionesPrueba} />} />
          <Route path="/perfil" element={ <Perfil foto={fotoPrueba} favoritos={favoritosPrueba} actividad={actividadPrueba} resenias={reseniasPrueba}/>} />
      
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