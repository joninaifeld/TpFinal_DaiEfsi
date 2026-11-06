import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Componentes/Header/Header";
import fotoPrueba from "./assets/FotoPerfilPrueba.png";

function App() {
  return (
    <BrowserRouter>
      <Header fotoPerfil={fotoPrueba} />

      <Routes>
        <Route path="/" element={<p>Home</p>} />
        <Route path="/explorar" element={<p>Explorar</p>} />
        <Route path="/biblioteca" element={<p>Biblioteca</p>} />
        <Route path="/estadisticas" element={<p>Estadísticas</p>} />
        <Route path="/perfil" element={<p>Perfil</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;