/* =========================================================
   ABELISSE — js/geo.js
   GEO y moneda global del proyecto
========================================================= */

// Opcional: aquí podrías usar un servicio de GEO por IP.
// Por ahora, usamos el idioma del navegador como aproximación.

function detectCountry() {
  const lang = navigator.language || navigator.userLanguage || "";

  const lower = lang.toLowerCase();

  // Si el navegador está en español de Perú
  if (lower === "es-pe") {
    return "PE";
  }

  // Aquí puedes ir agregando más países si quieres
  // if (lower === "es-us") return "US";

  // Por defecto, asumimos USA / resto del mundo
  return "US";
}

function getCurrencyFromCountry(countryCode) {
  if (countryCode === "PE") {
    return {
      code: "PEN",
      symbol: "S/",
      name: "Sol peruano"
    };
  }

  return {
    code: "USD",
    symbol: "$",
    name: "Dólar estadounidense"
  };
}

// Inicializar GEO global
(function initAbelisseGeo() {
  const country = detectCountry();
  const currency = getCurrencyFromCountry(country);

  window.ABELISSE_GEO = {
    country,
    currency
  };
})();
