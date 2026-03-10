import "./Reseñas.css";

export default function Reseñas() {
  return (
    <section className="reseñas" id="reseñas">
      <div className="reseñas-top">

        <div className="reseñas-col">
          <h3>ABELISSE</h3>
          <p>Cosmética y belleza con intención.</p>
        </div>

        <div className="reseñas-col">
          <h4>Ayuda</h4>
          <a href="#contacto">Contacto</a>
          <a href="#faq">Preguntas frecuentes</a>
        </div>

        <div className="reseñas-col">
          <h4>Síguenos</h4>
          <a href="#">Instagram</a>
          <a href="#">TikTok</a>
        </div>

      </div>

      <div className="reseñas-bottom">
        <p>© 2026 ABELISSE. Todos los derechos reservados.</p>
      </div>
    </section>
  );
}
