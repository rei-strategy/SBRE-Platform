"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  { href: "/dashboard/vendor", label: "Overview" },
  { href: "/dashboard/vendor/profile", label: "Profile setup" },
  { href: "/dashboard/vendor/verification", label: "Verification" },
  { href: "/dashboard/vendor/visibility", label: "Visibility" },
  { href: "/dashboard/vendor/leads", label: "Lead inbox" },
  { href: "/dashboard/vendor/routing", label: "Routing rules" },
  { href: "/dashboard/vendor/reviews", label: "Reviews" },
  { href: "/dashboard/vendor/analytics", label: "Analytics" },
  { href: "/dashboard/vendor/monetization", label: "Monetization" },
  { href: "/dashboard/vendor/expansion", label: "Expansion" },
];

export function VendorNav() {
  const pathname = usePathname();

  return (
    <div className="no-scrollbar flex gap-2 overflow-auto rounded-2xl border border-white/10 bg-white/5 p-2 text-xs uppercase tracking-[0.2em] text-white/60">
      {sections.map((section) => (
        <Link
          key={section.href}
          href={section.href}
          className={`rounded-xl px-4 py-2 transition ${
            pathname === section.href ? "bg-primary/20 text-white" : "hover:text-white"
          }`}
        >
          {section.label}
        </Link>
      ))}
    </div>
  );
}

