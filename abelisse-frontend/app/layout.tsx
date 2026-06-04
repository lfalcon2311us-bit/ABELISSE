
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResponsiveWrapper from "@/components/ResponsiveWrapper";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.abelisse.com"),

  title: {
    default: "ABELISSE – Cosmética y Belleza Premium",
    template: "%s | ABELISSE",
  },

  description:
    "ABELISSE es tu tienda online de cosmética, belleza y cuidado personal. Productos premium, envíos rápidos y una experiencia de compra impecable.",

  keywords: [
    "cosmética",
    "belleza",
    "maquillaje",
    "skincare",
    "tienda online",
    "productos de belleza",
    "cuidado personal",
    "ABELISSE",
  ],

  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://www.abelisse.com",
    siteName: "ABELISSE",
    title: "ABELISSE – Cosmética y Belleza Premium",
    description:
      "Descubre productos de belleza y cuidado personal seleccionados para ti.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ABELISSE – Cosmética y Belleza Premium",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ABELISSE – Cosmética y Belleza Premium",
    description:
      "Tienda online de belleza, cosmética y cuidado personal.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "https://www.abelisse.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-white text-gray-900 antialiased min-h-screen flex flex-col">
        <Navbar />

        <ResponsiveWrapper>
          <main className="flex-1 bg-white">{children}</main>
        </ResponsiveWrapper>

        <Footer />
      </body>
    </html>
  );
}
