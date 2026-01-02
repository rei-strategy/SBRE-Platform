"use client";

import { AlertTriangle, BellRing, LineChart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoggingMetricsPage() {
  return (
    <div className="min-h-screen bg-[#020409] px-6 py-16 text-white md:px-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <header>
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Ops Playbook</p>
          <h1 className="mt-3 text-4xl font-semibold">Logging · Metrics · Alerts</h1>
          <p className="mt-3 text-white/70">
            Monitor p95 latency and error rate with opinionated dashboards, thresholds, and on-call routing.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-primary/10 via-white/5 to-black/60 p-4 shadow-lg shadow-primary/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">p95 latency</p>
                <p className="text-3xl font-semibold">≤ 500 ms</p>
              </div>
              <LineChart className="h-6 w-6 text-primary" />
            </div>
            <p className="mt-2 text-xs text-white/60">SLO target. Alert triggers at &gt; 750 ms for 5 min sustained.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/10 via-white/5 to-black/60 p-4 shadow-lg shadow-amber-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Error rate</p>
                <p className="text-3xl font-semibold">&lt; 1%</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-amber-400" />
            </div>
            <p className="mt-2 text-xs text-white/60">Alert triggers at &gt; 2% over 3 min or &gt; 4σ spike across endpoints.</p>
          </div>
        </div>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              Dashboards
            </CardTitle>
            <CardDescription className="text-white/70">
              We track p95 latency + error rate in SBRE Ops Grafana.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-white/70">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <strong>Grafana / SBRE Core API</strong>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/60">
                  dashboards
                </span>
              </div>
              <ul className="mt-2 space-y-2 text-white/70">
                <li>• Latency panels: p50/p95 per service, plus per-endpoint drill-down.</li>
                <li>• Error rate panels: total, per service, and 4xx vs 5xx split.</li>
                <li>• “Golden Signals” row: RPS, saturation, queue depth for workers.</li>
              </ul>
              <div className="mt-3 flex flex-wrap gap-3">
                <Button size="sm" variant="secondary">
                  Open Grafana
                </Button>
                <Button size="sm" variant="ghost" className="border-white/20">
                  Shareable dashboard link
                </Button>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <strong>Loki Logs</strong>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/60">
                  saved queries
                </span>
              </div>
              <p className="mt-2">
                Structured JSON (req_id, tenant, release, status). Saved searches: “api-latency-alert” and “auth-5xx-burst”.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Alert thresholds
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm text-white/70 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">p95 latency</p>
              <p className="text-lg font-semibold text-white">Alert: &gt; 750 ms sustained 5 min</p>
              <p className="text-xs text-white/60">Routes to PagerDuty Sev2 with service + endpoint tags.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Error rate</p>
              <p className="text-lg font-semibold text-white">Alert: &gt; 2% for 3 min or &gt; 4σ spike</p>
              <p className="text-xs text-white/60">Sev1 page; includes last deploy SHA and suspect endpoints.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Background queue</p>
              <p className="text-lg font-semibold text-white">Alert: depth &gt; 5K for 10 min</p>
              <p className="text-xs text-white/60">Sends Slack warn, auto scales workers if capacity available.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Webhook failures</p>
              <p className="text-lg font-semibold text-white">Alert: &gt; 50 failures / min</p>
              <p className="text-xs text-white/60">Posts to incident channel with failing partner + sample payload.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-primary" />
              On-call channel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-white/70">
            <p>
              PagerDuty service “SBRE Core API” → schedule “SBRE Core Ops” (primary + secondary). Incidents auto-post to
              #sbre-ops-oncall in Slack with runbook + dashboard links.
            </p>
            <p>
              Playbook: ack within 5 min, status update within 15 min, mitigation plan within 30 min, retro doc within 24h.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="rounded-xl" variant="secondary">
                View PagerDuty schedule
              </Button>
              <Button className="rounded-xl" variant="ghost">
                Open incident runbook
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
