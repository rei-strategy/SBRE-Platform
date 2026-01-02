"use client";

import { LineChart } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  { label: "Response time", value: "3m 42s", delta: "-12s vs last week" },
  { label: "Lead → Quote rate", value: "58%", delta: "+4 pts" },
  { label: "Lead → Close rate", value: "33%", delta: "+2 pts" },
  { label: "Visibility impressions", value: "12,480", delta: "+18%" },
  { label: "Reviews growth", value: "+12", delta: "30 days" },
  { label: "Revenue attribution", value: "$183k", delta: "Connected via Stripe" },
];

export default function VendorAnalyticsPage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Step 7 · See what works</p>
        <h1 className="mt-2 text-3xl font-semibold">Analytics</h1>
        <p className="text-white/70">
          All funnel metrics in one dashboard, including Stripe-connected revenue attribution.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-white/10 bg-black/60">
            <CardHeader>
              <CardDescription className="text-white/70">{metric.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold">{metric.value}</CardTitle>
              <p className="text-sm text-white/60">{metric.delta}</p>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            Trend visualization
          </CardTitle>
          <CardDescription className="text-white/70">
            Sparkline preview; plug into actual charting in production.
          </CardDescription>
        </CardHeader>
        <CardContent className="rounded-3xl border border-white/10 bg-black/50 p-12 text-center text-white/60">
          Chart placeholder
        </CardContent>
      </Card>
    </div>
  );
}

