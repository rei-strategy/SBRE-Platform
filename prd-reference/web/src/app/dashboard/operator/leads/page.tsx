"use client";

import { ActivitySquare, GitMerge, Inbox } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const rows = [
  { vendor: "Summit Hardscapes", status: "Responded", sla: "2m 12s", escalation: "None" },
  { vendor: "Latitude Lending", status: "Awaiting documents", sla: "8m 34s", escalation: "Logged" },
  { vendor: "Peakstone Interiors", status: "Quoted", sla: "3m 09s", escalation: "None" },
];

export default function OperatorLeadManagementPage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Lead management</p>
        <h1 className="mt-2 text-3xl font-semibold">Track responses + SLAs.</h1>
        <p className="text-white/70">
          View all inbound vendor replies, routing logic, escalation logs, and SLA-based comparisons.
        </p>
      </header>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Inbox className="h-5 w-5 text-primary" />
            Inbound responses
          </CardTitle>
          <CardDescription className="text-white/70">Latest messages from vendors.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-white/70">
          {[
            "Summit Hardscapes: Site visit scheduled Friday.",
            "Latitude Lending: Need updated financials.",
            "Peakstone Interiors: Submitted revised bid.",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-black/40 p-3">
              {item}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitMerge className="h-5 w-5 text-primary" />
            Routing logic viewer
          </CardTitle>
          <CardDescription className="text-white/70">
            Understand which rule triggered each assignment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-white/70">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3">Rule 01 · Preferred vendor list</div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3">Rule 07 · SLA-based escalation</div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3">Rule 12 · High-risk incident route</div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ActivitySquare className="h-5 w-5 text-primary" />
            SLA + escalation comparison
          </CardTitle>
          <CardDescription className="text-white/70">
            See how vendors stack up against SLA commitments and escalation history.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3 text-sm text-white/70">
          {rows.map((row) => (
            <div key={row.vendor} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-lg font-semibold text-white">{row.vendor}</p>
              <p>Status: {row.status}</p>
              <p>SLA: {row.sla}</p>
              <p>Escalation: {row.escalation}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

