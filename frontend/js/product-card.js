/* =========================================================
   PRODUCT CARD UNIVERSAL — ABELISSE.COM (HTML + CSS + JS)
========================================================= */

function getCurrencyFromGeo() {
  const geo = window.ABELISSE_GEO || {
    currency: { code: "USD", symbol: "$" }
  };
  return geo.currency;
}

// Conversión temporal (cuando el backend devuelva USD directo, esto se ajusta)
const USD_RATE = 0.27; // 1 sol ≈ 0.27 USD (provisional)

function formatProductPrice(priceInSoles) {
  const currency = getCurrencyFromGeo();

  if (currency.code === "PEN") {
    return {
      symbol: currency.symbol,
      value: Number(priceInSoles).toFixed(2)
    };
  }

  // Convertir a USD
  return {
    symbol: currency.symbol,
    value: (Number(priceInSoles) * USD_RATE).toFixed(2)
  };
}

async function loadProducts(targetId, apiUrl) {
  const container = document.getElementById(targetId);
  if (!container) return;

  try {
    const res = await fetch(apiUrl);

    if (!res.ok) {
      container.innerHTML = `<p class="error-msg">Error al cargar productos.</p>`;
      return;
    }

    const products = await res.json();

    if (!Array.isArray(products) || products.length === 0) {
      container.innerHTML = `<p class="empty-msg">No hay productos disponibles.</p>`;
      return;
    }

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

      const mainPrice = formatProductPrice(precio_venta_soles ?? 0);
      const marketPrice = precio_mercado_soles
        ? formatProductPrice(precio_mercado_soles)
        : null;

      return `
        <div class="product-card">

          <a href="idproducto.html?id=${id}" class="product-link">

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
                <p class="price-main">${mainPrice.symbol} ${mainPrice.value}</p>

                ${marketPrice ? `
                  <p class="price-market">${marketPrice.symbol} ${marketPrice.value}</p>
                ` : ""}

                ${descuento_porcentaje ? `
                  <p class="price-off">-${descuento_porcentaje}% OFF</p>
                ` : ""}
              </div>

            </div>
          </a>

          <button class="product-add"
            data-add-to-cart
            data-id="${id}"
            data-name="${safeName}"
            data-price="${precio_venta_soles}"
            data-media="media-1">
            Añadir al carrito
          </button>

        </div>
      `;
    }).join("");

    attachAddToCartButtons();

  } catch (err) {
    console.error("❌ Error en loadProducts:", err);
    container.innerHTML = `<p class="error-msg">Error al cargar productos.</p>`;
  }
}
