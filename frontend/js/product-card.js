/* =========================================================
   PRODUCT CARD UNIVERSAL — ABELISSE.COM
   Compatible con moneda dinámica USD/PEN
========================================================= */

// Obtener moneda desde geo.js
function getCurrencyFromGeo() {
  const geo = window.ABELISSE_GEO || {
    currency: { code: "USD", symbol: "$" }
  };
  return geo.currency;
}

// NUEVA FUNCIÓN — precio correcto según país
function getProductPrice(product) {
  const geo = window.ABELISSE_GEO || { country: "US" };
  const isPeru = geo.country === "PE";

  const price_pen = Number(product.precio_venta_soles ?? 0);
  const price_usd = Number(product.precio_venta_usd ?? 0);

  return {
    symbol: isPeru ? "S/" : "$",
    value: isPeru ? price_pen : price_usd
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
        descripcion,
        imagen_principal,
        descuento_porcentaje,
        precio_venta_usd,
        precio_venta_soles,
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

      // Precio según país
      const priceInfo = getProductPrice(product);
      const price = priceInfo.value;
      const symbol = priceInfo.symbol;

      // Precio con descuento
      const finalPrice = descuento_porcentaje
        ? price * (1 - descuento_porcentaje / 100)
        : price;

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
                <p class="price-main">${symbol} ${finalPrice.toFixed(2)}</p>

                ${descuento_porcentaje ? `
                  <p class="price-market">${symbol} ${price.toFixed(2)}</p>
                  <p class="price-off">-${descuento_porcentaje}% OFF</p>
                ` : ""}
              </div>

            </div>
          </a>

          <button class="product-add"
            data-add-to-cart
            data-id="${id}"
            data-name="${safeName}"
            data-price-usd="${precio_venta_usd ?? 0}"
            data-price-pen="${precio_venta_soles ?? 0}"
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
