"use client";

import { useScreenSize } from "@/hooks/useScreenSize";

export default function ResponsiveWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { width } = useScreenSize();

  // Evitar errores mientras width es undefined en el primer render
  if (!width) {
    return <div className="px-4">{children}</div>;
  }

  if (width < 640) {
    return <div className="px-3">{children}</div>;
  }

  if (width < 1024) {
    return <div className="px-6">{children}</div>;
  }

  return <div className="px-8 max-w-6xl mx-auto">{children}</div>;
}
