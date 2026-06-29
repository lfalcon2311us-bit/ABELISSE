// =========================================================
// ABELISSE — js/idproducto.js (VERSIÓN PRO)
// Página de detalle de producto (frontend)
// =========================================================

// -----------------------------
// GEO — Moneda dinámica
// -----------------------------
function getCurrencyFromGeo() {
  const geo = window.ABELISSE_GEO || {
    currency: { code: "USD", symbol: "$" }
  };
  return geo.currency;
}

// Conversión temporal (cuando el backend devuelva USD directo, esto se ajusta)
const USD_RATE = 0.27;

// Formateo de precio con GEO
function formatProductPriceDetail(priceInSoles) {
  const currency = getCurrencyFromGeo();

  if (currency.code === "PEN") {
    return {
      symbol: currency.symbol,
      value: Number(priceInSoles).toFixed(2)
    };
  }

  return {
    symbol: currency.symbol,
    value: (Number(priceInSoles) * USD_RATE).toFixed(2)
  };
}

// -----------------------------
// Obtener ID desde la URL
// -----------------------------
function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// -----------------------------
// Cargar detalle del producto
// -----------------------------
async function loadProductDetail() {
  const id = getProductIdFromUrl();
  const container = document.getElementById("product-detail");

  if (!id) {
    container.innerHTML = `<p class="error-msg">Producto no especificado.</p>`;
    return;
  }

  try {
    const res = await fetch(`https://abelisse.onrender.com/api/productos/${id}/`);

    if (!res.ok) {
      container.innerHTML = `<p class="error-msg">Error al cargar el producto.</p>`;
      return;
    }

    const p = await res.json();

    if (!p || !p.id) {
      container.innerHTML = `<p class="error-msg">Producto no encontrado.</p>`;
      return;
    }

    renderProductDetail(p);

  } catch (err) {
    console.error("❌ Error en loadProductDetail:", err);
    container.innerHTML = `<p class="error-msg">Error al cargar el producto.</p>`;
  }
}

// -----------------------------
// Render del producto
// -----------------------------
function renderProductDetail(p) {
  const container = document.getElementById("product-detail");

  const img = p.imagen_principal && p.imagen_principal.length > 10
    ? p.imagen_principal
    : "img/placeholder.png";

  const mainPrice = formatProductPriceDetail(p.precio_venta_soles ?? 0);
  const marketPrice = p.precio_mercado_soles
    ? formatProductPriceDetail(p.precio_mercado_soles)
    : null;

  const rating = Math.round(Number(p.calificacion_promedio ?? 0));

  container.innerHTML = `
    <div class="product-detail-layout">

      <div class="product-detail-img">
        <img src="${img}" alt="${p.nombre}">
      </div>

      <div class="product-detail-info">

        <h1>${p.nombre ?? "Producto sin nombre"}</h1>

        <div class="product-rating">
          ${Array.from({length:5}).map((_,i)=>`
            <span class="star">${i < rating ? "★" : "☆"}</span>
          `).join("")}
          <span class="rating-number">${rating}.0 / 5</span>
        </div>

        <p class="product-brand">${p.marca ?? ""}</p>

        <p class="product-desc">${p.descripcion ?? ""}</p>

        <p class="product-stock">
          Stock disponible: ${p.stock ?? 0}
        </p>

        <div class="product-prices">
          <p class="price-main">${mainPrice.symbol} ${mainPrice.value}</p>

          ${marketPrice ? `
            <p class="price-market">${marketPrice.symbol} ${marketPrice.value}</p>
          ` : ""}

          ${p.descuento_porcentaje ? `
            <p class="price-off">-${p.descuento_porcentaje}% OFF</p>
          ` : ""}
        </div>

        <div class="product-qty">
          <label>Cantidad:</label>
          <div class="qty-stepper">
            <button type="button" id="qty-minus">–</button>
            <span id="qty-value">1</span>
            <button type="button" id="qty-plus">+</button>
          </div>
        </div>

        <button class="btn btn-primary" id="add-to-cart-detail">
          Añadir al carrito
        </button>

      </div>

    </div>
  `;

  initQtyAndCartDetail(p);
}

// -----------------------------
// Cantidad + Añadir al carrito
// -----------------------------
function initQtyAndCartDetail(product) {
  const minus = document.getElementById("qty-minus");
  const plus = document.getElementById("qty-plus");
  const qtyEl = document.getElementById("qty-value");
  const addBtn = document.getElementById("add-to-cart-detail");

  let qty = 1;

  minus.onclick = () => {
    qty = Math.max(1, qty - 1);
    qtyEl.textContent = qty;
  };

  plus.onclick = () => {
    qty = qty + 1;
    qtyEl.textContent = qty;
  };

  addBtn.onclick = () => {
    const cart = getCart();
    const existing = cart.find((item) => item.id === String(product.id));

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: String(product.id),
        name: product.nombre,
        price: parseFloat(product.precio_venta_soles),
        media: "media-1",
        qty: qty,
        stock: product.stock ?? 0
      });
    }

    saveCart(cart);
    showToast(`${product.nombre} añadido al carrito (${qty} uds.)`);
  };
}

// -----------------------------
// INIT
// -----------------------------
document.addEventListener("DOMContentLoaded", loadProductDetail);
