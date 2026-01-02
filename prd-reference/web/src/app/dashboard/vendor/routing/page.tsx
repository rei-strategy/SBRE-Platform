"use client";

import { AlarmClock, Compass, ToggleLeft } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const rules = [
  { title: "Primary vendor setting", detail: "Summit Hardscapes handles Midwest routes first." },
  { title: "Backup routing", detail: "Latitude Construction picks up if Summit declines." },
  { title: "SLA timer", detail: "5-minute timer triggers SMS + Slack reminders." },
  { title: "Out-of-office", detail: "Pause routes nightly 12a–5a except emergencies." },
];

export default function RoutingRulesPage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Step 6 · Lead routing</p>
        <h1 className="mt-2 text-3xl font-semibold">Control how SBRE sends you work.</h1>
        <p className="text-white/70">
          Primary coverage, backup rules, SLA timers, and out-of-office schedules make sure the right person claims each lead.
        </p>
      </header>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" />
            Routing configuration
          </CardTitle>
          <CardDescription className="text-white/70">
            Arrange priorities below; drag-and-drop in the live product.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {rules.map((rule) => (
            <div key={rule.title} className="rounded-2xl border border-white/10 bg-black/50 p-4">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">{rule.title}</p>
              <p className="mt-2 text-sm text-white/80">{rule.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlarmClock className="h-5 w-5 text-primary" />
            SLA timer
          </CardTitle>
          <CardDescription className="text-white/70">
            Customize reminders and escalation triggers if a lead isn’t claimed in time.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/70">
            Current setting: 5 minutes
          </div>
          <Button variant="secondary" className="rounded-xl">
            Adjust timer
          </Button>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ToggleLeft className="h-5 w-5 text-primary" />
            Out-of-office scheduling
          </CardTitle>
          <CardDescription className="text-white/70">Let SBRE know when to pause auto-routing.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {["Weeknights 12a–5a", "Holidays / custom dates"].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/70">
              {item}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

