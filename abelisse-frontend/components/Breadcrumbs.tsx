"use client";

import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-600 mb-6">
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-pink-600 transition"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="font-semibold text-gray-900"
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}

              {!isLast && <span className="text-gray-400">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
