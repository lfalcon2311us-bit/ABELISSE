import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResponsiveWrapper from "@/components/ResponsiveWrapper";

export const metadata: Metadata = {
  title: "ABELISSE - Cosmética y Belleza",
  description: "Belleza que realza tu esencia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="bg-white">
      <body className="bg-white text-gray-900 antialiased min-h-screen">
        {/* 🔥 Navbar global */}
        <Navbar />

        {/* 🔥 Wrapper responsivo para todo el contenido */}
        <ResponsiveWrapper>
          <main className="bg-white min-h-screen">{children}</main>
        </ResponsiveWrapper>

        {/* 🔥 Footer global */}
        <Footer />
      </body>
    </html>
  );
}
