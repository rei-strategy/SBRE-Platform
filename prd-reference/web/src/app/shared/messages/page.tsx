"use client";

import { MessageSquare } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const threads = [
  { subject: "SBRE Support · Ticket #1293", snippet: "Thanks for the quick turnaround..." },
  { subject: "Vendor: Summit Hardscapes", snippet: "We’re ready for the walkthrough tomorrow..." },
  { subject: "Lead update: Southbridge Retail", snippet: "New attachments uploaded..." },
];

export default function MessageCenterPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Message Center</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">All communications in one feed.</h1>
        <p className="text-white/70">
          Cross-role inbox for SBRE support, vendor threads, and lead updates.
        </p>
      </header>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <MessageSquare className="h-5 w-5 text-primary" />
            Inbox
          </CardTitle>
          <CardDescription className="text-white/70">Click to open detailed thread view.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-white/70">
          {threads.map((thread) => (
            <div key={thread.subject} className="rounded-2xl border border-white/10 bg-black/40 p-3">
              <p className="font-semibold text-white">{thread.subject}</p>
              <p>{thread.snippet}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

