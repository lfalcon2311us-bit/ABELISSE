import "./Ofertas.css";
import { Link } from "react-router-dom";

export default function Ofertas() {
  return (
    <section className="ofertas-section" id="ofertas">
      <div className="container">
        <div className="ofertas-content">
          <h2>Ofertas especiales</h2>
          <p>Hasta un 20% de descuento en colecciones seleccionadas.</p>

          <Link to="/ofertas" className="btn-ofertas">
            Ver ofertas
          </Link>
        </div>
      </div>
    </section>
  );
}
