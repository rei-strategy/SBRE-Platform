"use client";

import { BellRing } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Notifications Center</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Stay informed everywhere.</h1>
        <p className="text-white/70">
          Configure email, SMS, Slack, and in-app notifications across SBRE Connect™.
        </p>
      </header>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BellRing className="h-5 w-5 text-primary" />
            Channels
          </CardTitle>
          <CardDescription className="text-white/70">Toggle which events trigger each channel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-white/70">
          {["New lead alerts", "Compliance updates", "Invoice reminders", "Incident escalations"].map((item) => (
            <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
              <span>{item}</span>
              <button className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.3em]">
                Enabled
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="text-white">Slack webhooks</CardTitle>
          <CardDescription className="text-white/70">Route high-priority alerts to dedicated channels.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="https://hooks.slack.com/services/..." />
          <Button className="rounded-xl">Save webhook</Button>
        </CardContent>
      </Card>
    </div>
  );
}

