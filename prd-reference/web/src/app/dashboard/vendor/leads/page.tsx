"use client";

import { MessageCircle, PhoneForwarded } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const categories = [
  { title: "New leads", count: 6, description: "Awaiting first response" },
  { title: "Active leads", count: 14, description: "In conversation / quoting" },
  { title: "Closed leads", count: 58, description: "Won or lost within 90 days" },
];

const threads = [
  {
    title: "Southbridge Retail · Build-out",
    status: "Auto-response sent · SLA 3m remaining",
    summary: "Need multi-site refresh. Provide timeline + budget confirmation.",
  },
  {
    title: "Hearthstone Living · Seasonal staffing",
    status: "Operator replied · 2 new messages",
    summary: "Staff 10 properties for spring. Provide crew availability.",
  },
];

export default function LeadInboxPage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Steps 4 + 5 · Lead Inbox</p>
        <h1 className="mt-2 text-3xl font-semibold">Centralize every interaction.</h1>
        <p className="text-white/70">
          View new leads, active conversations, auto-responses, and SMS/email threads. Assign or reassign within team mode.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.title} className="border-white/10 bg-black/60">
            <CardHeader>
              <CardTitle>{category.title}</CardTitle>
              <CardDescription className="text-white/70">{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold">{category.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Threads + auto responses
          </CardTitle>
          <CardDescription className="text-white/70">
            Template-driven replies keep SLA timers happy. Real-time SMS/email view below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {threads.map((thread) => (
            <div key={thread.title} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-lg font-semibold">{thread.title}</p>
              <p className="text-sm text-white/60">{thread.status}</p>
              <p className="mt-2 text-sm text-white/70">{thread.summary}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PhoneForwarded className="h-5 w-5 text-primary" />
            Assign / reassign
          </CardTitle>
          <CardDescription className="text-white/70">
            Team mode lets you route leads to the right teammate instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {["Primary contact: Taylor Chen", "Backup: Anita Flores"].map((assignment) => (
            <div key={assignment} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              {assignment}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

