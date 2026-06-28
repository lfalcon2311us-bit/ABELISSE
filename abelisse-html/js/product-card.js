/* =========================================================
   PRODUCT CARD UNIVERSAL — ABELISSE.COM (HTML + CSS + JS)
========================================================= */

async function loadProducts(targetId, apiUrl) {
  const container = document.getElementById(targetId);
  if (!container) return;

  const res = await fetch(apiUrl);
  const products = await res.json();

  container.innerHTML = products.map(product => {
    const {
      id,
      nombre,
      precio_venta_soles,
      precio_mercado_soles,
      descuento_porcentaje,
      imagen_principal,
      descripcion,
      calificacion_promedio,
      stock
    } = product;

    const safeName = nombre ?? "Producto sin nombre";
    const safeDesc = descripcion ?? "";
    const shortDesc = safeDesc.length > 120 ? safeDesc.slice(0,120) + "..." : safeDesc;

    const img = (imagen_principal && imagen_principal.length > 10)
      ? imagen_principal
      : "img/placeholder.png";

    const rating = Math.round(Number(calificacion_promedio ?? 0));

    return `
      <div class="product-card">
        <a href="producto.html?id=${id}" class="product-link">

          <div class="product-img">
            <img src="${img}" alt="${safeName}">
          </div>

          <div class="product-body">

            <h3 class="product-title">${safeName}</h3>

            <div class="product-rating">
              ${Array.from({length:5}).map((_,i)=>`
                <span class="star">${i < rating ? "★" : "☆"}</span>
              `).join("")}
              <span class="rating-number">${rating}.0 / 5</span>
            </div>

            <p class="product-desc">${shortDesc}</p>

            <div class="product-prices">
              <p class="price-main">S/ ${Number(precio_venta_soles ?? 0).toFixed(2)}</p>
              ${precio_mercado_soles ? `<p class="price-market">S/ ${Number(precio_mercado_soles).toFixed(2)}</p>` : ""}
              ${descuento_porcentaje ? `<p class="price-off">-${descuento_porcentaje}% OFF</p>` : ""}
            </div>

            <button class="product-add"
              data-add-to-cart
              data-id="${id}"
              data-name="${safeName}"
              data-price="${precio_venta_soles}"
              data-media="media-1">
              Añadir al carrito
            </button>

          </div>
        </a>
      </div>
    `;
  }).join("");

  attachAddToCartButtons();
}
