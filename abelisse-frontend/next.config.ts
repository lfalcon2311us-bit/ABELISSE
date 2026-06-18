import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  poweredByHeader: false,
  compress: true,

  images: {
    unoptimized: false,
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

  // ⭐ ESTA ES LA FORMA CORRECTA EN NEXT 16 PARA SHARP EN RENDER
  outputFileTracingIncludes: {
    "/": ["node_modules/sharp/**/*"],
  },

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react"],
  },

  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{member}}",
    },
  },

  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_BACKEND_URL ??
          "https://abelisse-backend.onrender.com"
        }/:path*`,
      },
    ];
  },

  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  trailingSlash: false,
};

export default nextConfig;
