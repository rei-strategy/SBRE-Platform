"use client";

import { ClipboardCheck, Heart, MapPinned, Quote, Receipt, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const matches = [
  {
    title: "Vendor matches near properties",
    description: "17 vendors within 10 miles across 4 categories.",
    items: ["5 contractors", "4 inspectors", "3 lenders", "5 maintenance crews"],
  },
  {
    title: "Request quotes",
    description: "Send project briefs to selected vendors with one click.",
    items: ["Retail renovation · 3 vendors selected", "Tenant turnover · 4 vendors selected"],
  },
  {
    title: "Auto-route to vendor",
    description: "SLA + badge data determine order.",
    items: ["Emergency maintenance: Summit Hardscapes", "Restoration: Latitude Construction"],
  },
];

const saved = [
  { label: "Favorite vendors", detail: "Summit Hardscapes, Latitude Lending, Peakstone Interiors" },
  { label: "Saved vendor lists", detail: "Dallas Retail Crew, National Lenders, Elite Inspectors" },
  { label: "Project overview", detail: "6 active projects, 14 tasks awaiting vendor updates" },
];

export default function OperatorDashboardPage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Business / Operator dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold">Coordinate every vendor, every property.</h1>
        <p className="text-white/70">
          Request bids, monitor routing, and keep compliant partners on speed dial across the SBRE network.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {matches.map((card) => (
          <Card key={card.title} className="border-white/10 bg-black/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPinned className="h-5 w-5 text-primary" />
                {card.title}
              </CardTitle>
              <CardDescription className="text-white/70">{card.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-white/70">
              {card.items.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/40 p-3">
                  {item}
                </div>
              ))}
              {card.title === "Request quotes" && (
                <Button variant="secondary" className="mt-3 rounded-xl">
                  Compose request
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {saved.map((item) => (
          <Card key={item.label} className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {item.label.includes("Favorite") ? (
                  <Heart className="h-5 w-5 text-primary" />
                ) : item.label.includes("Project") ? (
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                ) : (
                  <Star className="h-5 w-5 text-primary" />
                )}
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/70">{item.detail}</CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Quote className="h-5 w-5 text-primary" />
            Lead management & SLA comparison
          </CardTitle>
          <CardDescription className="text-white/70">
            Compare leading vendors on response time, quote speed, and satisfaction.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[
            { vendor: "Summit Hardscapes", response: "3m", quote: "1.2h", rating: "4.9" },
            { vendor: "Latitude Lending", response: "7m", quote: "2.4h", rating: "4.7" },
            { vendor: "Peakstone Interiors", response: "4m", quote: "1.5h", rating: "4.8" },
          ].map((row) => (
            <div key={row.vendor} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-lg font-semibold">{row.vendor}</p>
              <p className="text-sm text-white/60">Response {row.response}</p>
              <p className="text-sm text-white/60">Quote {row.quote}</p>
              <p className="text-sm text-white/60">Rating {row.rating}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Order details & admin
          </CardTitle>
          <CardDescription className="text-white/70">
            Timeline of states, synced payment status, and invoice downloads for ops.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3 text-sm text-white/70">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="text-white">Order #20418</p>
            <p className="text-xs text-white/60">Timeline</p>
            <ul className="mt-2 space-y-1">
              <li>• Created → Payment intent</li>
              <li>• Tax calculated → Captured</li>
              <li>• Receipt emailed → Invoice posted</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="text-white">Payment status synced</p>
            <p className="text-xs text-white/60">Stripe + ledger</p>
            <p className="mt-2">
              Status: <span className="font-semibold text-white">Succeeded</span>
            </p>
            <p className="text-xs text-white/60">Intent: pi_48f9; Order ID persists.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="text-white">Invoice + receipt</p>
            <p className="text-xs text-white/60">Downloadable PDF + email proof</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Button size="sm" variant="secondary" className="rounded-xl">
                Download invoice
              </Button>
              <Button size="sm" variant="ghost" className="rounded-xl">
                Resend receipt
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
