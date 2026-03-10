import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";

import Categorias from "./components/Categorias/Categorias";
import Productos from "./components/Productos/Productos";
import Ofertas from "./components/Ofertas/Ofertas";
import Contacto from "./components/Contacto/Contacto";
import Reseñas from "./components/Reseñas/Reseñas";

import "./App.css";

function App() {
  return (
    <div className="abelisse-body">
      <Navbar />

      <Routes>
        {/* INICIO */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Categorias />
              <Productos />
              <Ofertas />
              <Contacto />
              <Reseñas />
            </>
          }
        />

        {/* PRODUCTOS */}
        <Route path="/productos" element={<Productos />} />

        {/* OFERTAS */}
        <Route path="/ofertas" element={<Ofertas />} />

        {/* CATEGORÍAS */}
        <Route path="/categorias" element={<Categorias />} />

        {/* CONTACTO */}
        <Route path="/contacto" element={<Contacto />} />

        {/* RESEÑAS */}
        <Route path="/reseñas" element={<Reseñas />} />
      </Routes>
    </div>
  );
}

export default App;
