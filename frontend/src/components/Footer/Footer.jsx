import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">

        <div className="footer-col">
          <h3>ABELISSE</h3>
          <p>Cosmética y belleza con intención.</p>
        </div>

        <div className="footer-col">
          <h4>Ayuda</h4>
          <a href="#contacto">Contacto</a>
          <a href="#faq">Preguntas frecuentes</a>
        </div>

        <div className="footer-col">
          <h4>Síguenos</h4>
          <a href="#">Instagram</a>
          <a href="#">TikTok</a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 ABELISSE. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}