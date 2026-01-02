"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard/vendor", label: "Vendor" },
  { href: "/dashboard/operator", label: "Business / Operator" },
  { href: "/dashboard/enterprise", label: "Enterprise Admin" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 text-sm">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`rounded-xl px-4 py-2 transition ${
            pathname === item.href ? "bg-primary/20 text-white" : "text-white/70 hover:text-white"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

