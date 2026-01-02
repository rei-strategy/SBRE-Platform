"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard/enterprise", label: "Overview" },
  { href: "/dashboard/enterprise/oversight", label: "Vendor oversight" },
  { href: "/dashboard/enterprise/routing", label: "Routing rules" },
  { href: "/dashboard/enterprise/integrations", label: "API & integrations" },
  { href: "/dashboard/enterprise/expansion", label: "Expansion toolkit" },
];

export function EnterpriseNav() {
  const pathname = usePathname();

  return (
    <div className="no-scrollbar flex gap-2 overflow-auto rounded-2xl border border-white/10 bg-white/5 p-2 text-xs uppercase tracking-[0.2em] text-white/60">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`rounded-xl px-4 py-2 transition ${
            pathname === link.href ? "bg-primary/20 text-white" : "hover:text-white"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

