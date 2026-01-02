"use client";

import { ClipboardList } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const statuses = [
  { ticket: "#1924", subject: "Verification question", status: "Open" },
  { ticket: "#1888", subject: "Billing adjustment", status: "Resolved" },
  { ticket: "#1870", subject: "Lead routing issue", status: "In progress" },
];

export default function SupportTicketsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Support Tickets</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Open or track tickets.</h1>
        <p className="text-white/70">Upload files, check status, or create new requests.</p>
      </header>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <ClipboardList className="h-5 w-5 text-primary" />
            New ticket
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Subject" />
          <textarea className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/70" rows={4} placeholder="Describe issue" />
          <Button className="rounded-xl">Submit ticket</Button>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="text-white">Status tracker</CardTitle>
          <CardDescription className="text-white/70">View ticket updates at a glance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-white/70">
          {statuses.map((row) => (
            <div key={row.ticket} className="rounded-2xl border border-white/10 bg-black/40 p-3">
              <p className="text-white">{row.ticket}</p>
              <p>{row.subject}</p>
              <p>Status: {row.status}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

