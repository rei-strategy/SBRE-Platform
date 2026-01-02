"use client";

import { BarChart2, Crown, Globe2, ShieldAlert, Trophy } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  { label: "Active vendors", value: "2,140", detail: "Across 42 states" },
  { label: "Verification rate", value: "93%", detail: "Within SLA" },
  { label: "Avg. response time", value: "4m 08s", detail: "Goal: 5m" },
  { label: "Conversion rate", value: "34%", detail: "+5 pts vs last quarter" },
];

const leaderboard = [
  { region: "Texas", score: "4.9", notes: "Top response time" },
  { region: "Southeast", score: "4.8", notes: "Highest conversion" },
  { region: "Pacific", score: "4.7", notes: "Satisfaction leader" },
];

export default function EnterpriseDashboardPage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Enterprise Admin dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold">Command the SBRE network at scale.</h1>
        <p className="text-white/70">
          Monitor regions, approve vendors, and push routing rules from one high-signal control plane.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-white/10 bg-black/60">
            <CardHeader>
              <CardDescription className="text-white/70">{metric.label}</CardDescription>
              <CardTitle className="text-3xl font-semibold">{metric.value}</CardTitle>
              <p className="text-sm text-white/60">{metric.detail}</p>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Vendor performance leaderboard
          </CardTitle>
          <CardDescription className="text-white/70">
            Identify high-performing regions and share best practices.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {leaderboard.map((entry) => (
            <div key={entry.region} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-lg font-semibold">{entry.region}</p>
              <p className="text-sm text-white/60">Score {entry.score}</p>
              <p className="text-sm text-white/60">{entry.notes}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Vendor oversight queue",
            icon: ShieldAlert,
            items: ["12 accounts pending review", "4 flagged for document renewal", "2 disputes awaiting resolution"],
          },
          {
            title: "Routing rules (cross-region)",
            icon: Globe2,
            items: ["Texas → SE overflow route", "Custom SLA for Latitude Retail", "Escalation path for high-risk bids"],
          },
          {
            title: "Expansion toolkit",
            icon: Crown,
            items: ["Market launch templates", "Partner reporting exports", "API connections (Snowflake, Salesforce)"],
          },
        ].map((panel) => (
          <Card key={panel.title} className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <panel.icon className="h-5 w-5 text-primary" />
                {panel.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/70">
              {panel.items.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/40 p-3">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            Marketplace health
          </CardTitle>
          <CardDescription className="text-white/70">
            Snapshot of density, search peaks, and satisfaction signals.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Vendor density hot zones", value: "+12 markets" },
            { label: "Peak search times", value: "Tue/Thu 9a-12p" },
            { label: "Trust scorecards", value: "A-" },
            { label: "Growth vs churn", value: "+18% YoY" },
          ].map((row) => (
            <div key={row.label} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-sm text-white/60">{row.label}</p>
              <p className="mt-2 text-2xl font-semibold">{row.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
