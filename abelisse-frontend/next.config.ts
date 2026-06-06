import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // 🔥 Requerido para Render
  output: "standalone",

  // 🔥 Seguridad
  poweredByHeader: false,
  compress: true,

  // 🔥 Imágenes optimizadas
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "abelisse-backend.onrender.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  // 🔥 Optimización avanzada
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react"],
  },

  // 🔥 Modularización de imports
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{member}}",
    },
  },

  // 🔥 Rewrites para backend (SEGURO PARA STANDALONE)
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://abelisse-backend.onrender.com"}/:path*`,
      },
    ];
  },

  // 🔥 Logging útil para Render
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // 🔥 Requerido para standalone en Render
  serverExternalPackages: ["sharp"],

  // 🔥 Evitar que un error de TS rompa producción
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
