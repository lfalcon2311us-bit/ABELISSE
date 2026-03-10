import "./Hero.css";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Belleza que realza tu esencia</h1>
        <p className="hero-subtitle">
          Cosmética premium inspirada en elegancia, tecnología y cuidado real.
        </p>

        <Link to="/productos" className="hero-button">
          Explorar productos
        </Link>
      </div>
    </section>
  );
}
