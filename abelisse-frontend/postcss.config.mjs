const isProd = process.env.NODE_ENV === "production";

export default {
  plugins: {
    // ⭐ Nesting moderno compatible con Tailwind
    "postcss-nesting": {},

    // ⭐ Tailwind
    tailwindcss: {},

    // ⭐ Fixes de flexbox para Safari y móviles
    "postcss-flexbugs-fixes": {},

    // ⭐ Compatibilidad con navegadores (sin nesting duplicado)
    "postcss-preset-env": {
      stage: 3,
      features: {
        "nesting-rules": false, // ❗ Desactivado para evitar conflicto
      },
    },

    // ⭐ Minificación solo en producción
    ...(isProd ? { cssnano: { preset: "default" } } : {}),
  },
};
