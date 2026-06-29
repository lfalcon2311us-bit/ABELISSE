/* =========================================================
   ABELISSE — js/main.js
   Lógica de interfaz (demo). El carrito usa localStorage
   únicamente para poder mostrar los estados de la pantalla
   (vacío / con productos). Sustituye estas funciones por las
   llamadas a tu backend / base de datos real cuando conectes
   los productos.
   ========================================================= */

const CART_KEY = 'abelisse_cart';

/* ---------------------------------------------------------
   Utilidades
--------------------------------------------------------- */

// ACTIVAR MONEDA GLOBAL DESDE GEO
function formatPrice(value) {
  const geo = window.ABELISSE_GEO || {
    currency: { symbol: "$" }
  };

  const symbol = geo.currency.symbol || "$";
  return symbol + ' ' + Number(value).toFixed(2);
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function cartTotalItems(cart) {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function cartTotalPrice(cart) {
  return cart.reduce((sum, item) => sum + item.qty * item.price, 0);
}

/* ---------------------------------------------------------
   Menú móvil (tu menú original)
--------------------------------------------------------- */
function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

/* ---------------------------------------------------------
   MARCAR PESTAÑA ACTIVA SEGÚN LA URL
--------------------------------------------------------- */
function marcarPestanaActiva() {
  const path = window.location.pathname;

  document.querySelectorAll('.nav-link, .nav-cart').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (path.endsWith(href)) {
      link.classList.add('active');
    }

    if ((path === "/" || path.endsWith("index.html")) && href === "/") {
      link.classList.add('active');
    }
  });
}

/* ---------------------------------------------------------
   Badge del carrito (header)
--------------------------------------------------------- */
function updateCartBadge() {
  const total = cartTotalItems(getCart());
  document.querySelectorAll('.cart-count').forEach((el) => {
    el.textContent = total;
    el.style.display = total > 0 ? 'inline-flex' : 'none';
  });
}

/* ---------------------------------------------------------
   Toast de confirmación
--------------------------------------------------------- */
let toastTimeout;
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

/* ---------------------------------------------------------
   Añadir al carrito
--------------------------------------------------------- */
function attachAddToCartButtons() {
  document.querySelectorAll('[data-add-to-cart]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const { id, name, price, media } = btn.dataset;
      const cart = getCart();
      const existing = cart.find((item) => item.id === id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ id, name, price: parseFloat(price), media: media || 'media-1', qty: 1 });
      }
      saveCart(cart);
      showToast(`${name} añadido al carrito`);
    });
  });
}

/* ---------------------------------------------------------
   Render de la página de carrito
--------------------------------------------------------- */
function svgBottleIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 3h6M10 3v3.2c0 .4-.15.78-.42 1.07L8 9v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V9l-1.58-1.73A1.6 1.6 0 0 1 14 6.2V3"/>
    <path d="M8.5 13h7"/>
  </svg>`;
}

function renderCartPage() {
  const root = document.getElementById('cart-root');
  if (!root) return;

  const emptyEl = document.getElementById('cart-empty');
  const filledEl = document.getElementById('cart-filled');
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');

  function render() {
    const cart = getCart();

    if (cart.length === 0) {
      emptyEl.style.display = 'block';
      filledEl.style.display = 'none';
      return;
    }

    emptyEl.style.display = 'none';
    filledEl.style.display = 'block';

    itemsEl.innerHTML = cart.map((item) => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item__thumb ${item.media}">${svgBottleIcon()}</div>
        <div class="cart-item__info">
          <h4>${item.name}</h4>
          <div class="cart-item__price">${formatPrice(item.price)}</div>
          <div class="cart-item__stock">Stock disponible: ${item.stock ?? 10}</div>
          <div class="qty-stepper">
            <button type="button" data-action="decrease">–</button>
            <span>${item.qty}</span>
            <button type="button" data-action="increase">+</button>
          </div>
        </div>
        <button type="button" class="cart-item__remove" data-action="remove">Eliminar</button>
      </div>
    `).join('');

    totalEl.textContent = formatPrice(cartTotalPrice(cart));
  }

  itemsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const itemEl = btn.closest('.cart-item');
    const id = itemEl.dataset.id;
    let cart = getCart();
    const item = cart.find((p) => p.id === id);
    if (!item) return;

    if (btn.dataset.action === 'increase') item.qty += 1;
    if (btn.dataset.action === 'decrease') item.qty = Math.max(1, item.qty - 1);
    if (btn.dataset.action === 'remove') cart = cart.filter((p) => p.id !== id);

    saveCart(cart);
    render();
  });

  const clearBtn = document.getElementById('clear-cart');
  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      saveCart([]);
      render();
    });
  }

  render();
}

/* =========================================================
   HEADER PREMIUM — BÚSQUEDA BLINDADA
========================================================= */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const toast = document.getElementById("toast");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

if (menuToggle) {
  menuToggle.onclick = () => {
    navMenu.classList.toggle("mobile-open");
  };
}

/* ------------------------------
   BUSCADOR ULTRA SEGURO
------------------------------ */

// Solo letras (incluye acentos y ñ)
const safeRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/;

// Limitar 5 búsquedas iguales en 24 horas
function canSearchTerm(term) {
  const key = `search_${term.toLowerCase()}`;
  const data = JSON.parse(localStorage.getItem(key));

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  if (!data) {
    localStorage.setItem(key, JSON.stringify({ count: 1, last: now }));
    return true;
  }

  if (now - data.last > dayMs) {
    localStorage.setItem(key, JSON.stringify({ count: 1, last: now }));
    return true;
  }

  if (data.count >= 5) {
    return false;
  }

  localStorage.setItem(key, JSON.stringify({ count: data.count + 1, last: now }));
  return true;
}

function buscarProductoSeguro() {
  const term = searchInput.value.trim();

  if (!term || !safeRegex.test(term)) {
    alert("Por favor ingresa solo letras. No se permiten números ni símbolos.");
    return;
  }

  if (!canSearchTerm(term)) {
    alert("Has buscado este término demasiadas veces hoy. Intenta mañana.");
    return;
  }

  window.location.href = `productos.html?buscar=${encodeURIComponent(term)}`;
}

if (searchBtn) searchBtn.onclick = buscarProductoSeguro;

if (searchInput) {
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buscarProductoSeguro();
    }
  });
}

/* ---------------------------------------------------------
   Init
--------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  updateCartBadge();
  attachAddToCartButtons();
  renderCartPage();
  marcarPestanaActiva();
});

/* =========================================================
   HOME — TOP 5 CLASIFICACIONES
========================================================= */

function loadTopHome(targetId, apiUrl) {
  const container = document.getElementById(targetId);
  if (!container) return;

  fetch(apiUrl)
    .then(res => res.json())
    .then(products => {
      container.innerHTML = products.map(product => {
        const img = product.imagen_principal && product.imagen_principal.length > 10
          ? product.imagen_principal
          : "img/placeholder.png";

        return `
          <div class="product-card">
            <a href="idproducto.html?id=${product.id}" class="product-link">

              <div class="product-img">
                <img src="${img}" alt="${product.nombre}">
              </div>

              <div class="product-body">
                <h3 class="product-title">${product.nombre}</h3>

                <p class="product-desc">${product.descripcion ?? ""}</p>

                <div class="product-prices">
                  ${formatPrice(product.precio_venta_soles)}
                </div>

                <button class="product-add"
                  data-add-to-cart
                  data-id="${product.id}"
                  data-name="${product.nombre}"
                  data-price="${product.precio_venta_soles}">
                  Añadir al carrito
                </button>
              </div>

            </a>
          </div>
        `;
      }).join("");

      attachAddToCartButtons();
    });
}
