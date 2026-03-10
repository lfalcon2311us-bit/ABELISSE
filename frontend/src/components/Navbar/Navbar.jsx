import "./Navbar.css";
import logo from "/logo.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="brand">
        <span className="brand-text">ABELISSE</span>
        <img src={logo} alt="Logo Abelisse" className="brand-logo" />
      </div>

      <nav className="menu">
        <Link to="/">Inicio</Link>
        <Link to="/productos">Productos</Link>
        <Link to="/ofertas">Ofertas</Link>
        <Link to="/categorias">Categorías</Link>
        <Link to="/contacto">Contacto</Link>
        <Link to="/reseñas">Reseñas</Link>
      </nav>
    </header>
  );
}
