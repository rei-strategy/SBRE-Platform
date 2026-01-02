"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/shared/notifications", label: "Notifications" },
  { href: "/shared/settings", label: "Settings" },
  { href: "/shared/billing", label: "Billing" },
  { href: "/shared/2fa", label: "Two-Factor" },
  { href: "/shared/messages", label: "Message Center" },
  { href: "/shared/help-center", label: "Help Center" },
  { href: "/shared/support", label: "Help & Support" },
  { href: "/shared/support-tickets", label: "Support Tickets" },
  { href: "/shared/tutorials", label: "Tutorials" },
  { href: "/shared/terms", label: "Terms & Privacy" },
  { href: "/shared/community", label: "Community" },
  { href: "/shared/contact", label: "Contact Support" },
];

export function SharedNav() {
  const pathname = usePathname();

  return (
    <div className="no-scrollbar flex gap-2 overflow-auto rounded-2xl border border-white/10 bg-white/5 p-2 text-xs uppercase tracking-[0.2em] text-white/60">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`rounded-xl px-4 py-2 transition ${pathname === link.href ? "bg-primary/20 text-white" : "hover:text-white"}`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
