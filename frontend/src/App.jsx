import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import "./App.css";

function App() {
  return (
    <div className="abelisse-body">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO PRINCIPAL */}
      <Hero />

      {/* CATEGORÍAS DESTACADAS */}
      <section className="categories" id="maquillaje">
        <h2>Categorías destacadas</h2>
        <div className="categories-grid">
          <article className="category-card">Maquillaje</article>
          <article className="category-card">Cuidado de la piel</article>
          <article className="category-card">Fragancias</article>
          <article className="category-card">Accesorios</article>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="featured-products">
        <h2>Favoritos de ABELISSE</h2>
        <div className="products-grid">
          {/* Aquí van tus cards de producto */}
        </div>
      </section>

      {/* COMUNIDAD / NEWSLETTER */}
      <section className="community">
        <div className="community-content">
          <h2>Únete a la comunidad ABELISSE</h2>
          <p>Accede a lanzamientos exclusivos, tips de belleza y beneficios especiales.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Tu correo electrónico" />
            <button type="submit" className="primary-btn">Unirme</button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="main-footer">
        <div className="footer-columns">
          <div>
            <h3>ABELISSE</h3>
            <p>Cosmética y belleza con intención.</p>
          </div>
          <div>
            <h3>Ayuda</h3>
            <a href="#contacto">Contacto</a><br />
            <a href="#faq">Preguntas frecuentes</a>
          </div>
          <div>
            <h3>Síguenos</h3>
            <a href="#">Instagram</a><br />
            <a href="#">TikTok</a>
          </div>
        </div>
        <p className="footer-copy">© 2026 ABELISSE. Todos los derechos reservados.</p>
      </footer>

    </div>
  );
}

export default App;
