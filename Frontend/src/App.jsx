import { BrowserRouter, Routes, Route } from "react-router-dom";
import FotoPerfil from "./Componentes/FotoPerfil/FotoPerfil";
import fotoPrueba from "./assets/FotoPerfilprueba.png";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "40px" }}>
        <FotoPerfil foto={fotoPrueba} />
      </div>

      <Routes>
        <Route path="/" element={<p>Home</p>} />
        <Route path="/perfil" element={<p>Página de perfil</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;