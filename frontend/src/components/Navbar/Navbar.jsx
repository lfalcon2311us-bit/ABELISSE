import "./Navbar.css";
import logo from "/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate("/productos?search=" + search.trim());
    }
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">

        {/* IZQUIERDA: LOGO + NOMBRE */}
        <div className="brand-block">
          <img src={logo} alt="Logo Abelisse" className="brand-logo" />
          <span className="brand-text">ABELISSE</span>
        </div>

        {/* CENTRO: BARRA DE BÚSQUEDA */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar productos, categorías o descuentos…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>

        {/* DERECHA: MENÚ */}
        <nav className="menu">
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/ofertas">Ofertas</Link>
          <Link to="/categorias">Categorías</Link>
          <Link to="/contacto">Contacto</Link>
          <Link to="/reseñas">Reseñas</Link>
        </nav>

      </div>
    </header>
  );
}
