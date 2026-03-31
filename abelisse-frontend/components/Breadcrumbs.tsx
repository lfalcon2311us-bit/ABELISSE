"use client";

import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="text-sm text-gray-600 mb-6">
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-pink-600 transition"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-gray-900">{item.label}</span>
            )}

            {index < items.length - 1 && <span>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
