"use client";

import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ContactSupportPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Contact Support</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Escalate tickets with context.</h1>
        <p className="text-white/70">Direct line to SBRE support with severity tagging.</p>
      </header>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Send className="h-5 w-5 text-primary" />
            Submit ticket
          </CardTitle>
          <CardDescription className="text-white/70">We respond within 1 business day.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Subject" />
          <textarea
            className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/70"
            rows={5}
            placeholder="Describe issue / urgency"
          />
          <div className="flex flex-wrap gap-3 text-sm text-white/70">
            <button className="rounded-full border border-white/20 px-4 py-2">Severity: Normal</button>
            <button className="rounded-full border border-white/20 px-4 py-2">Attach logs</button>
          </div>
          <Button className="rounded-xl">Send to support</Button>
        </CardContent>
      </Card>
    </div>
  );
}

