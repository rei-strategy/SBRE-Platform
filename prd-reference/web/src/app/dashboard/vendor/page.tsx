"use client";

import { BarChart3, Inbox, Shield } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  { label: "Verification score", value: "94%", detail: "All licenses current" },
  { label: "Lead response", value: "3m 42s", detail: "Goal: under 5m" },
  { label: "Leads this week", value: "32", detail: "+12% vs last week" },
];

const tasks = [
  { title: "Upload updated COI", status: "Due in 3 days" },
  { title: "Respond to Hearthstone RFP", status: "5m SLA remaining" },
  { title: "Request review from Latitude CRE", status: "Suggested" },
];

export default function VendorDashboardPage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Vendor dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold">Visibility + trust cockpit</h1>
        <p className="text-white/70">Monitor verification, handle leads, and see what’s working across SBRE Connect™.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
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

      <div className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Inbox className="h-5 w-5 text-primary" />
              Lead inbox
            </CardTitle>
            <CardDescription className="text-white/70">Auto-SLA timer is live. Keep responses under 5 minutes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-white/80">
            {[
              "Restoration request · Northwind Retail · SLA 3m remaining",
              "Retail build-out · Peakstone Partners · SLA 9m remaining",
              "Landscaping maintenance · SummitFund · SLA cleared",
            ].map((lead) => (
              <div key={lead} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                {lead}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Trust checklist
            </CardTitle>
            <CardDescription className="text-white/70">Finish the items below to keep your badge green.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/80">
            {tasks.map((task) => (
              <div key={task.title} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="font-semibold">{task.title}</p>
                <p className="text-white/60">{task.status}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Performance pulse
          </CardTitle>
          <CardDescription className="text-white/70">
            Lead-to-quote, lead-to-close, and review velocity for the last 30 days.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          {[
            { label: "Lead → Quote", value: "58%" },
            { label: "Lead → Close", value: "33%" },
            { label: "Reviews growth", value: "+12" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-sm text-white/60">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold">{item.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
