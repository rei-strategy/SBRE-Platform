"use client";

import { Megaphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const templates = [
  "Lead alert templates",
  "No-response escalation template",
  "Review request scripts",
  "Bulk announcements",
];

export default function AdminCommunicationsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Communications Templates</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Manage platform-integrated templates.</h1>
        <p className="text-white/70">
          Centralized place for internal teams to update lead alerts, escalation scripts, and review outreach.
        </p>
      </header>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Megaphone className="h-5 w-5 text-primary" />
            Templates
          </CardTitle>
          <CardDescription className="text-white/70">
            Push updates to all automations instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {templates.map((template) => (
            <div key={template} className="rounded-2xl border border-white/10 bg-black/40 p-4 text-white">
              <p>{template}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="text-white">Edit template</CardTitle>
          <CardDescription className="text-white/70">Sync changes back to the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Template name" />
          <textarea className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/70" rows={4} placeholder="Script / message" />
          <Button className="rounded-xl">Save</Button>
        </CardContent>
      </Card>
    </div>
  );
}
