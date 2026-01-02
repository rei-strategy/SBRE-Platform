"use client";

import { Activity, BarChart4, Banknote, FileDown, LineChart, Rocket, Workflow } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const toolkit = [
  { title: "Market launch templates", description: "Use SBRE’s Year 3–5 playbooks to enter new regions." },
  { title: "Multi-market replication wizard", description: "Clone campaigns and routing rules across markets." },
  { title: "Enterprise analytics", description: "Layer custom metrics and exports on top of SBRE data." },
  { title: "Partner reporting", description: "Share performance dashboards with partners." },
];

const kpiStreams = [
  { label: "MAU", value: "42,180", note: "Daily refresh · Owner: PM (Dana West)" },
  { label: "Revenue (Marketplace)", value: "$1.9M", note: "By stream: Marketplace, Ads, Subscriptions" },
  { label: "Revenue (Ads)", value: "$420K", note: "Definitions doc linked · GAAP aligned" },
];

const exports = [
  { label: "Raw events CSV", detail: "Versioned schema v1.4 · PII minimized (hashed IDs)" },
  { label: "Warehouse sync", detail: "Snowflake nightly; success/failure notification to #data-alerts" },
  { label: "Exports owner", detail: "Data Eng · RACI stored in analytics handbook" },
];

const coreEvents = [
  { label: "Signup", detail: "Schema validated; idempotent on user_id + source" },
  { label: "Purchase", detail: "Order + payment intent IDs logged; sample logs reviewed" },
  { label: "Ad click", detail: "Placement + campaign IDs; anti-duplication window 10m" },
];

const reconciliation = [
  { label: "Daily report", detail: "Payouts vs. orders; generated 2am CST" },
  { label: "Missing payouts", detail: "Flagged and posted to #finance-ops" },
  { label: "Exceptions export", detail: "CSV download of discrepancies + notes" },
];

export default function EnterpriseExpansionPage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Expansion & Scaling Toolkit</p>
        <h1 className="mt-2 text-3xl font-semibold">Orchestrate national launches.</h1>
        <p className="text-white/70">
          Inspired by the SBRE roadmap: launch templates, replication wizards, analytics, and partner reporting.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {toolkit.map((item) => (
          <Card key={item.title} className="border-white/10 bg-black/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                {item.title}
              </CardTitle>
              <CardDescription className="text-white/70">{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="rounded-xl">
                Open toolkit
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-primary" />
            Replication wizard
          </CardTitle>
          <CardDescription className="text-white/70">
            Step through launching SBRE in a new market.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {[
            { label: "Select template", detail: "Retail multi-market" },
            { label: "Regions", detail: "Texas, Southeast" },
            { label: "Team owners", detail: "Marcus Lee, Taylor Chen" },
            { label: "Go-live date", detail: "June 1" },
          ].map((step) => (
            <div key={step.label} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-sm text-white/60">{step.label}</p>
              <p className="mt-2 text-lg font-semibold">{step.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart4 className="h-5 w-5 text-primary" />
            Enterprise analytics & partner reporting
          </CardTitle>
          <CardDescription className="text-white/70">
            Export dashboards and share progress with stakeholders.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-white/70">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3">Analytics exports · CSV / Snowflake</div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3">Partner portal access · 8 active</div>
          <Button className="rounded-xl">Schedule report</Button>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            KPI dashboard (MAU + revenue by stream)
          </CardTitle>
          <CardDescription className="text-white/70">
            Daily refresh, definitions doc linked, clear owner assigned.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {kpiStreams.map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-sm text-white/60">{kpi.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{kpi.value}</p>
              <p className="text-xs text-white/60">{kpi.note}</p>
              <Button variant="ghost" size="sm" className="mt-3 rounded-full border border-white/20">
                Open definitions doc
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-primary" />
            Export raw events
          </CardTitle>
          <CardDescription className="text-white/70">
            Versioned schemas, minimized PII, notifications on success/failure.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {exports.map((exp) => (
            <div key={exp.label} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-sm text-white/60">{exp.label}</p>
              <p className="mt-2 text-white">{exp.detail}</p>
            </div>
          ))}
          <div className="md:col-span-3 flex flex-wrap gap-3">
            <Button variant="secondary" className="rounded-xl">
              Export CSV
            </Button>
            <Button variant="ghost" className="rounded-xl">
              View schema versions
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Emit core events
          </CardTitle>
          <CardDescription className="text-white/70">
            Signup, purchase, ad click events validated with idempotency.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {coreEvents.map((event) => (
            <div key={event.label} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-sm text-white/60">{event.label}</p>
              <p className="mt-2 text-white/80">{event.detail}</p>
            </div>
          ))}
          <div className="md:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-white/60">
              Sample logs reviewed; schema validation enforced before emit; idempotency keys on user_id + timestamp window.
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-primary" />
            Finance reconciliation
          </CardTitle>
          <CardDescription className="text-white/70">
            Daily payout vs. order reconciliation with exceptions export.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {reconciliation.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-sm text-white/60">{item.label}</p>
              <p className="mt-2 text-white/80">{item.detail}</p>
            </div>
          ))}
          <div className="md:col-span-3 flex flex-wrap gap-3">
            <Button variant="secondary" className="rounded-xl">
              Download exceptions CSV
            </Button>
            <Button variant="ghost" className="rounded-xl">
              Open daily report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
