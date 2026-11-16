import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Componentes/Header/Header";
import Footer from "./Componentes/Footer/Footer";
import fotoPrueba from "./assets/FotoPerfilprueba.png";
import Perfil from "./Componentes/Perfil/Perfil";
import {
  favoritosPrueba,
  actividadPrueba,
  reseniasPrueba,
} from "./Componentes/datosPrueba";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Header fotoPerfil={fotoPrueba} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<p>Home</p>} />
          <Route
            path="/perfil"
            element={
              <Perfil
                foto={fotoPrueba}
                favoritos={favoritosPrueba}
                actividad={actividadPrueba}
                resenias={reseniasPrueba}
              />
            }
          />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;