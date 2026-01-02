"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navSections = [
  {
    label: "Marketing",
    links: [
      { label: "Landing", href: "/" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Categories", href: "/categories" },
      { label: "Vendor Benefits", href: "/vendor-benefits" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    label: "Dashboards",
    links: [
      { label: "Vendor", href: "/dashboard/vendor" },
      { label: "Operators", href: "/dashboard/operator" },
      { label: "Enterprise", href: "/dashboard/enterprise" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "Sign Up", href: "/auth/signup" },
      { label: "Login", href: "/auth/login" },
      { label: "Shared Pages", href: "/shared/notifications" },
      { label: "Support Center", href: "/shared/help-center" },
      { label: "Ops · Logging & Alerts", href: "/ops/logging" },
      { label: "Ops · DB Runbook", href: "/ops/db-restore" },
    ],
  },
  {
    label: "Admin",
    links: [
      { label: "Global Dashboard", href: "/admin" },
      { label: "Comms Templates", href: "/admin/communications" },
      { label: "Monetization", href: "/admin/monetization" },
      { label: "Analytics", href: "/admin/analytics" },
    ],
  },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    setActiveMenu(label);
  };

  const handleMouseLeave = (label: string) => {
    hoverTimeout.current = setTimeout(() => {
      setActiveMenu((current) => (current === label ? null : current));
    }, 120);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to Content
      </a>
      <div className="mx-auto flex w-full max-w-[90rem] items-center justify-between px-6 py-4 md:px-12">
        <Link href="/" className="text-lg font-semibold tracking-[0.2em] text-white">
          SBRE Connect™
        </Link>
        <nav
          className={cn(
            "absolute left-0 right-0 top-full flex flex-col gap-4 border-b border-white/10 bg-black/90 px-6 py-6 text-sm text-white/80 transition md:static md:flex md:flex-row md:items-center md:gap-6 md:border-none md:bg-transparent md:px-0 md:py-0",
            open ? "visible opacity-100" : "invisible md:visible md:opacity-100 opacity-0",
          )}
        >
          <div className="hidden items-center gap-6 md:flex">
            {navSections.map((section) => (
              <div
                key={section.label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(section.label)}
                onMouseLeave={() => handleMouseLeave(section.label)}
              >
                <button className="inline-flex items-center gap-1 text-white/80 hover:text-primary">
                  {section.label}
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div
                  className={cn(
                    "absolute top-full left-0 mt-3 min-w-[220px] rounded-2xl border border-white/10 bg-black/90 p-4 shadow-2xl transition",
                    activeMenu === section.label ? "visible opacity-100" : "invisible opacity-0",
                  )}
                >
                  <div className="grid gap-2 text-sm">
                    {section.links.map((link) => (
                      <Link key={link.href} href={link.href} className="text-white/70 hover:text-primary">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4 md:hidden">
            {navSections.map((section) => (
              <div key={section.label}>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">{section.label}</p>
                <div className="mt-2 flex flex-col gap-2">
                  {section.links.map((link) => (
                    <Link key={link.href} href={link.href} className="text-white/80 hover:text-primary">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button size="sm" variant="ghost" asChild>
            <Link href="/auth/signup">SIGN UP</Link>
          </Button>
        </nav>
        <button
          className="inline-flex items-center justify-center rounded-full border border-white/20 px-3 py-2 text-sm text-white md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
    </header>
  );
}
