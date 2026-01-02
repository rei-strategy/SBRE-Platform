"use client";

import { LifeBuoy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SupportPortalPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Help & Support Portal</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Knowledge base + ticketing.</h1>
        <p className="text-white/70">Articles, contact forms, and escalation workflows for every role.</p>
      </header>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <LifeBuoy className="h-5 w-5 text-primary" />
            Search help center
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Search articles (e.g., verification, routing)" />
          <div className="grid gap-2 text-sm text-white/70 md:grid-cols-2">
            {[
              "How to set up your profile",
              "Understanding ranking",
              "Lead routing explained",
              "Billing questions",
              "Fixing rejected documents",
            ].map((article) => (
              <div key={article} className="rounded-2xl border border-white/10 bg-black/40 p-3">
                {article}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="text-white">Open ticket</CardTitle>
          <CardDescription className="text-white/70">Escalates to SBRE support with status tracking.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Subject" />
          <textarea className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/70" rows={4} placeholder="Describe the issue" />
          <Button className="rounded-xl">Submit ticket</Button>
        </CardContent>
      </Card>
    </div>
  );
}

