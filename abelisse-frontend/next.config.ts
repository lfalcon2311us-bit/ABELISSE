import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Permite imágenes desde tu backend y CDNs
      },
    ],
  },

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react"], // Optimiza imports pesados
  },

  compress: true, // Activa compresión GZIP/Brotli en producción
};

export default nextConfig;
