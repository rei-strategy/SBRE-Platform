"use client";

import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Personalize your workspace.</h1>
        <p className="text-white/70">Manage contact info, time zone, and notification defaults.</p>
      </header>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Settings2 className="h-5 w-5 text-primary" />
            Profile
          </CardTitle>
          <CardDescription className="text-white/70">Basic account info.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Full name" />
          <Input placeholder="Organization" />
          <Input placeholder="Work email" />
          <Input placeholder="Phone" />
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="text-white">Preferences</CardTitle>
          <CardDescription className="text-white/70">Time zone, units, and dark mode.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-white/70">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3">Time zone: Central</div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3">Units: Imperial</div>
          <Button className="rounded-xl">Update settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}

