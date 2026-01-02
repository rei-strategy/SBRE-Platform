"use client";

import { ArrowUpRight, CalendarRange, CreditCard, DollarSign, LineChart, Megaphone, Rocket, Target, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const upgrades = [
  { title: "Upgrade to Pro", description: "Routing priority, automation, analytics, Elite badge eligibility." },
  { title: "Featured placement boosts", description: "Own the top slots for priority metros during key weeks." },
  { title: "Category boost add-ons", description: "Promote new service lines with targeted visibility." },
];

const billing = [
  { label: "Subscription", value: "Pro · $349/mo · Stripe" },
  { label: "Next invoice", value: "Apr 28 · $349" },
  { label: "Refunds available", value: "Within 30 days" },
];

const credits = [
  { label: "Ad credit wallet", value: "$1,200 available", note: "Spend limits enforced per campaign" },
  { label: "Sponsorship package", value: "Elite Metro Boost · $2,500", note: "Invoice generated at purchase" },
  { label: "Receipt", value: "PDF + email confirmation", note: "Audit trail recorded" },
];

const campaigns = [
  { label: "Budget caps", detail: "Hard cap $5,000; daily cap $350; stops serving at limit", icon: DollarSign },
  { label: "Date range validation", detail: "Start: Apr 10 · End: May 12 · Block past dates", icon: CalendarRange },
  { label: "Targeting + creatives", detail: "Metro: Dallas, Category: Restoration; Creative rules: 1200x628, <150KB, no text overflow", icon: Target },
];

const serving = [
  { label: "Placement A/B live", detail: "Map banner vs. listing inline; weighted 50/50", icon: Megaphone },
  { label: "Frequency cap", detail: "3 impressions/user/day; 1 per session", icon: Rocket },
  { label: "Fallback creative", detail: "Serve default SBRE ad if no qualified creative", icon: Wallet },
];

const reporting = [
  { label: "Spend", value: "$1,240", note: "Within ±5% of events; USD timezone: CST" },
  { label: "Impressions", value: "48,220", note: "Deduped; aligns to ad server events" },
  { label: "Clicks", value: "6,110", note: "CTR 12.6%; export CSV" },
];

export default function MonetizationPage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Step 8 · Monetization & Upgrades</p>
        <h1 className="mt-2 text-3xl font-semibold">Invest in reach.</h1>
        <p className="text-white/70">
          Move from Verified to Pro and Elite, purchase boosts, and manage billing via Stripe.
        </p>
      </header>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Growth opportunities
          </CardTitle>
          <CardDescription className="text-white/70">Curated upgrades matched to your pipeline.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {upgrades.map((upgrade) => (
            <div key={upgrade.title} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-lg font-semibold">{upgrade.title}</p>
              <p className="mt-2 text-sm text-white/70">{upgrade.description}</p>
              <Button variant="secondary" className="mt-4 rounded-xl">
                Explore
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            Campaign creation
          </CardTitle>
          <CardDescription className="text-white/70">
            Set budget, dates, targeting, and creatives with enforced rules.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {campaigns.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-center gap-2 text-white">
                  <Icon className="h-5 w-5 text-primary" />
                  {item.label}
                </div>
                <p className="mt-2 text-sm text-white/70">{item.detail}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Billing portal
          </CardTitle>
          <CardDescription className="text-white/70">
            Manage subscriptions, refunds, and invoices through Stripe.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {billing.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-sm text-white/60">{item.label}</p>
              <p className="mt-2 text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Serve ads (placements)
          </CardTitle>
          <CardDescription className="text-white/70">
            Placement A/B live, frequency caps, and fallback creatives when targeting fails.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {serving.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-center gap-2 text-white">
                  <Icon className="h-5 w-5 text-primary" />
                  {item.label}
                </div>
                <p className="mt-2 text-sm text-white/70">{item.detail}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            Ad reporting
          </CardTitle>
          <CardDescription className="text-white/70">
            Spend, impressions, clicks with ±5% parity to events, CST timezone, CSV export.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {reporting.map((row) => (
            <div key={row.label} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-sm text-white/60">{row.label}</p>
              <p className="mt-2 text-xl font-semibold text-white">{row.value}</p>
              <p className="text-xs text-white/60">{row.note}</p>
            </div>
          ))}
          <div className="md:col-span-3">
            <Button variant="secondary" className="rounded-xl">
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Ad credits & sponsorship
          </CardTitle>
          <CardDescription className="text-white/70">
            Buy credit packages, enforce spend limits, and generate invoices automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {credits.map((credit) => (
            <div key={credit.label} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-sm text-white/60">{credit.label}</p>
              <p className="mt-2 text-lg font-semibold text-white">{credit.value}</p>
              <p className="text-xs text-white/60">{credit.note}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Transactions
          </CardTitle>
          <CardDescription className="text-white/70">Refunds & invoice history.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-white/70">
          {["Invoice #1832 · Paid · $349", "Refund #0791 · Processed · $199"].map((row) => (
            <div key={row} className="rounded-2xl border border-white/10 bg-black/40 p-3">
              {row}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
