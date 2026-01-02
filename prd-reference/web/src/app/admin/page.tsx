"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const controls = [
  { title: "User role management", description: "Grant or revoke access for vendors, operators, enterprise teams." },
  { title: "Vendor verification queue", description: "Approve/deny from the central pipeline." },
  { title: "Dispute resolution panel", description: "Track open disputes and assign mediators." },
  { title: "Fraud / flagged accounts", description: "Investigate suspicious activity." },
  { title: "System health monitoring", description: "API uptime, webhook delivery, background jobs." },
  { title: "Marketplace load metrics", description: "Region-level traffic and usage." },
];

const subscriptions = [
  { account: "Atlas Holdings", status: "Active", lastInvoice: "#INV-7821", amount: "$4,900", link: "Last invoice" },
  { account: "Summit Partners", status: "Trial", lastInvoice: "—", amount: "$0", link: "Start billing" },
  { account: "Harbor CRE", status: "Canceled", lastInvoice: "#INV-7718", amount: "$2,900", link: "Invoice PDF" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Global Admin Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Run the national marketplace.</h1>
        <p className="text-white/70">Controls for SBRE internal teams to manage vendors, disputes, and system health.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Active vendors", value: "3,540" },
          { label: "System uptime", value: "99.98%" },
          { label: "Open disputes", value: "8" },
        ].map((metric) => (
          <Card key={metric.label} className="border-white/10 bg-black/60">
            <CardHeader>
              <CardDescription className="text-white/70">{metric.label}</CardDescription>
              <CardTitle className="text-3xl font-semibold text-white">{metric.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Subscription status (finance)</CardTitle>
          <CardDescription className="text-white/70">
            Filter by state, open last invoice links, and export for month-end.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {["Active", "Trial", "Canceled"].map((filter) => (
              <button
                key={filter}
                className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:border-primary hover:text-primary"
              >
                {filter}
              </button>
            ))}
            <Button size="sm" variant="secondary" className="rounded-full">
              Export CSV
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {subscriptions.map((row) => (
              <div key={row.account} className="rounded-2xl border border-white/10 bg-black/50 p-4 text-white">
                <p className="text-lg font-semibold">{row.account}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-white/60">{row.status}</p>
                <p className="mt-2 text-sm text-white/70">
                  Last invoice: {row.lastInvoice} · {row.amount}
                </p>
                <Button variant="ghost" size="sm" className="mt-3 rounded-full border border-white/20 text-white/80">
                  {row.link}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {controls.map((control) => (
          <Card key={control.title} className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">{control.title}</CardTitle>
              <CardDescription className="text-white/70">{control.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
