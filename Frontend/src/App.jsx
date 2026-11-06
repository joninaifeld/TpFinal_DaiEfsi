import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Componentes/Header/Header";
import Footer from "./Componentes/Footer/Footer";
import fotoPrueba from "./assets/FotoPerfilprueba.png";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Header fotoPerfil={fotoPrueba} />

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