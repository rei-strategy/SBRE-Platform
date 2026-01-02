"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
  { title: "Tier setup", description: "Manage Basic, Pro, Enterprise offerings." },
  { title: "Feature boost inventory", description: "Featured placements + add-ons." },
  { title: "Price experiments", description: "A/B test pricing and promotions." },
  { title: "Coupon codes", description: "Create limited-time discount codes." },
  { title: "Marketplace ads manager", description: "Control featured placements." },
];

const approvals = [
  "Review checklist (budget caps, dates, targeting, creatives)",
  "Approval gate before serving to placements",
  "Audit log of decisions + timestamps",
];

export default function AdminMonetizationPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Monetization System</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Revenue levers in one console.</h1>
        <p className="text-white/70">
          For internal teams to adjust tiers, boosts, experiments, coupons, and marketplace ads.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {sections.map((section) => (
          <Card key={section.title} className="border-white/10 bg-black/60">
            <CardHeader>
              <CardTitle className="text-white">{section.title}</CardTitle>
              <CardDescription className="text-white/70">{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="rounded-xl">
                Manage
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Ad approvals</CardTitle>
          <CardDescription className="text-white/70">
            Approve or reject campaigns before serving; maintain auditability.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-white/70">
          {approvals.map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-black/40 p-3">
              {item}
            </div>
          ))}
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="rounded-xl">
              Open review queue
            </Button>
            <Button variant="ghost" className="rounded-xl">
              View audit log
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
