import "./Categorias.css";

export default function Categorias() {
  return (
    <section className="categorias-section" id="categorias">
      <h2>Categorías</h2>

      <div className="grid-categorias">
        <article className="categoria-card">Labiales</article>
        <article className="categoria-card">Delineadores</article>
        <article className="categoria-card">Rubores</article>
        <article className="categoria-card">Bronzer</article>
        <article className="categoria-card">Bases</article>
        <article className="categoria-card">Iluminadores</article>
        <article className="categoria-card">Fijadores de maquillaje</article>
        <article className="categoria-card">Primer</article>
        <article className="categoria-card">Serums y cremas</article>
        <article className="categoria-card">Cosmetiqueras</article>
        <article className="categoria-card">Polvos traslúcidos</article>
        <article className="categoria-card">Aceites corporales</article>
      </div>
    </section>
  );
}
