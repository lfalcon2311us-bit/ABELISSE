/** @type {import('tailwindcss').Config} */
module.exports = {
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
    // Clases generadas dinámicamente
    { pattern: /bg-(pink|red|green|blue|yellow)-(100|200|300|400|500)/ },
    { pattern: /text-(pink|red|green|blue|yellow)-(500|600|700)/ },
    { pattern: /grid-cols-(1|2|3|4|5|6)/ },
  ],

  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
