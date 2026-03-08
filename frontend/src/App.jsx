import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";

// Importaremos estos componentes cuando los crees
import Categorias from "./components/Categorias/Categorias";
import Productos from "./components/Productos/Productos";
import Ofertas from "./components/Ofertas/Ofertas";
import Contacto from "./components/Contacto/Contacto";
import Footer from "./components/Footer/Footer";

import "./App.css";

function App() {
  return (
    <div className="abelisse-body">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO PRINCIPAL */}
      <Hero />

      {/* CATEGORÍAS */}
      <Categorias />

      {/* PRODUCTOS DESTACADOS */}
      <Productos />

      {/* OFERTAS */}
      <Ofertas />

      {/* CONTACTO / NEWSLETTER */}
      <Contacto />

      {/* FOOTER */}
      <Footer />

    </div>
  );
}

export default App;