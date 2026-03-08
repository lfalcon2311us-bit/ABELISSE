import "./Navbar.css";
import logo from "../../assets/logo.png";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="brand">
        <span className="brand-text">ABELISSE</span>
        <img src={logo} alt="Logo Abelisse" className="brand-logo" />
      </div>

      <nav className="menu">
        <a href="#">Inicio</a>
        <a href="#">Productos</a>
        <a href="#">Ofertas</a>
        <a href="#">Categorías</a>
        <a href="#">Contacto</a>
      </nav>
    </header>
  );
}
