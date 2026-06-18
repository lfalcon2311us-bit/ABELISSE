/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",

  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./store/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        abelisse: {
          pink: "#ff4f9a",
          dark: "#0a0a0a",
          light: "#fdf2f8",
        },
      },

      boxShadow: {
        premium: "0 12px 24px rgba(0,0,0,0.12)",
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },

  safelist: [
    // Colores dinámicos
    { pattern: /bg-(pink|red|green|blue|yellow)-(100|200|300|400|500)/ },
    { pattern: /text-(pink|red|green|blue|yellow)-(500|600|700)/ },

    // Grid dinámico
    { pattern: /grid-cols-(1|2|3|4|5|6)/ },

    // Padding y margin dinámicos (por si usas componentes premium)
    { pattern: /(p|px|py|m|mx|my)-(0|1|2|3|4|5|6|8|10|12)/ },
  ],

  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("postcss-nesting"),
  ],
};
