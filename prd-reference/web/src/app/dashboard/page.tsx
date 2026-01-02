"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

const routes = [
  { label: "Vendor dashboard", href: "/dashboard/vendor", description: "View verification, leads, and analytics." },
  { label: "Business / Operator dashboard", href: "/dashboard/operator", description: "Manage requests, routing, and projects." },
  { label: "Enterprise Admin dashboard", href: "/dashboard/enterprise", description: "Monitor regional metrics and vendor oversight." },
];

export default function DashboardIndexPage() {
  return (
    <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-10 text-white">
      <h1 className="text-3xl font-semibold">Choose your live dashboard.</h1>
      <p className="text-white/70">
        In production this routing happens automatically based on account type. For this prototype, pick a view to preview.
      </p>
      <div className="space-y-4">
        {routes.map((route) => (
          <div key={route.href} className="rounded-2xl border border-white/10 bg-black/60 p-4">
            <p className="text-lg font-semibold">{route.label}</p>
            <p className="text-sm text-white/70">{route.description}</p>
            <Button className="mt-4 rounded-xl" asChild>
              <Link href={route.href}>Launch view</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

