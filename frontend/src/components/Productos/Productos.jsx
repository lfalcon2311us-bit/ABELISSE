import "./Productos.css";

export default function Productos() {
  return (
    <section className="productos-section" id="productos">
      <h2>Favoritos de ABELISSE</h2>

      <div className="productos-grid">

        <article className="producto-card">
          <div className="producto-imagen"></div>
          <h3>Serum Iluminador Floral</h3>
          <p className="producto-desc">Hidratación ligera con acabado glow.</p>
          <p className="precio">$24.99</p>
          <button className="btn-producto">Agregar al carrito</button>
        </article>

        <article className="producto-card">
          <div className="producto-imagen"></div>
          <h3>Paleta AI Glow</h3>
          <p className="producto-desc">Sombras suaves en tonos rosados y dorados.</p>
          <p className="precio">$32.50</p>
          <button className="btn-producto">Agregar al carrito</button>
        </article>

        <article className="producto-card">
          <div className="producto-imagen"></div>
          <h3>Labial Mate Rosa Suave</h3>
          <p className="producto-desc">Color intenso, textura ligera.</p>
          <p className="precio">$14.90</p>
          <button className="btn-producto">Agregar al carrito</button>
        </article>

        <article className="producto-card">
          <div className="producto-imagen"></div>
          <h3>Crema Facial Día & Noche</h3>
          <p className="producto-desc">Cuidado diario para una piel radiante.</p>
          <p className="precio">$27.00</p>
          <button className="btn-producto">Agregar al carrito</button>
        </article>

      </div>
    </section>
  );
}
