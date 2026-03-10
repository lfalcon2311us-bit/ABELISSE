import "./Contacto.css";

export default function Contacto() {
  return (
    <section className="contacto-section" id="contacto">
      <div className="container">
        <div className="contacto-content">
          <h2>Únete a la comunidad ABELISSE</h2>
          <p>Recibe novedades, lanzamientos y ofertas exclusivas.</p>

          <form className="contacto-form">
            <input 
              type="email" 
              placeholder="Tu correo electrónico" 
              required 
            />
            <button type="submit" className="btn-contacto">
              Suscribirme
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
