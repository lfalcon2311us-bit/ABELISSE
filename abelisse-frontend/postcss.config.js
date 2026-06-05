module.exports = {
  plugins: {
    // Nesting moderno compatible con Tailwind
    "postcss-nesting": {},

    // Tailwind
    tailwindcss: {},

    // Fixes de flexbox para Safari y móviles
    "postcss-flexbugs-fixes": {},

    // Compatibilidad con navegadores
    "postcss-preset-env": {
      stage: 3,
      features: {
        "nesting-rules": true,
      },
    },

    // Minificación solo en producción
    ...(process.env.NODE_ENV === "production"
      ? { cssnano: { preset: "default" } }
      : {}),
  },
};
