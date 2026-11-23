import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import PrivateRoute from "./Componentes/PrivateRoute.jsx";
import Header from "./Componentes/Header/Header.jsx";
import Footer from "./Componentes/Footer/Footer.jsx";
import Login from "./Componentes/Login/Login.jsx";
import Registro from "./Componentes/Registro/Registro.jsx";
import Explorar from "./Componentes/Explorar/Explorar.jsx";
import Perfil from "./Componentes/Perfil/Perfil";
import DetalleLibro from "./Componentes/DetalleLibro/DetalleLibro";
import Home from "./Componentes/Home/Home.jsx";
import Estadisticas from "./Componentes/Estadisticas/Estadisticas.jsx";
import Biblioteca from "./Componentes/Biblioteca/Biblioteca";
import Coleccion from "./Componentes/Coleccion/Coleccion.jsx";
import "./App.css";

function PaginaLibro() {
  const { id } = useParams();
  return <DetalleLibro olid={id} />;
}

function AppContent() {
  const location = useLocation();
  const ocultarHeader = ["/login", "/registro"].includes(location.pathname);

  return (
    <>
      {!ocultarHeader && <Header />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/explorar" element={<PrivateRoute><Explorar /></PrivateRoute>} />
          <Route path="/biblioteca" element={<PrivateRoute><Biblioteca /></PrivateRoute>} />
          <Route path="/estadisticas" element={<PrivateRoute><Estadisticas /></PrivateRoute>} />
          <Route path="/coleccion/:id" element={<PrivateRoute><Coleccion /></PrivateRoute>} />
          <Route path="/libro/:id" element={<PrivateRoute><PaginaLibro /></PrivateRoute>} />
          <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
