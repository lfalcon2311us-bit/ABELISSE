import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tailwind from "eslint-plugin-tailwindcss";

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    plugins: {
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      tailwindcss: tailwind,
    },

    rules: {
      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Accesibilidad
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "warn",

      // Tailwind
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-custom-classname": "off",

      // Buenas prácticas
      "no-unused-vars": "warn",
      "no-console": "off",
      "prefer-const": "warn",
    },
  },

  // Ignorar carpetas generadas
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
]);
