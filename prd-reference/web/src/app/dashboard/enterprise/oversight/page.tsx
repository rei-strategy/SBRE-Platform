"use client";

import { Ban, CheckCircle2, ClipboardList, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const queue = [
  { vendor: "Summit Hardscapes", action: "Approve / Reject" },
  { vendor: "Latitude Lending", action: "Suspend / Reinstate" },
  { vendor: "Peakstone Interiors", action: "Bulk messaging" },
];

const listings = [
  { title: "Premium Staging Package", state: "Pending review", owner: "Summit Hardscapes" },
  { title: "Express Inspection", state: "Needs changes", owner: "Latitude Lending" },
  { title: "Retail Fit-out Bundle", state: "Approved", owner: "Peakstone Interiors" },
];

export default function EnterpriseOversightPage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Vendor Oversight</p>
        <h1 className="mt-2 text-3xl font-semibold">Keep the marketplace healthy.</h1>
        <p className="text-white/70">
          Approve or reject accounts, reinstate vendors, bulk message regions, and review verification queues.
        </p>
      </header>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Region-level verification queue</CardTitle>
          <CardDescription className="text-white/70">Operators awaiting approval.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {queue.map((item) => (
            <div key={item.vendor} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-lg font-semibold">{item.vendor}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-white/70">
                <Button variant="secondary" size="sm" className="rounded-xl">
                  {item.action}
                </Button>
                <Button variant="ghost" size="sm" className="rounded-xl">
                  View docs
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Listing approvals
          </CardTitle>
          <CardDescription className="text-white/70">
            Review queue with audit logs; vendors notified on approve/reject.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {listings.map((listing) => (
            <div key={listing.title} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <div className="flex items-center justify-between text-white">
                <p className="font-semibold">{listing.title}</p>
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60">
                  {listing.state}
                </span>
              </div>
              <p className="text-sm text-white/60">Vendor: {listing.owner}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-white/70">
                <Button variant="secondary" size="sm" className="rounded-xl">
                  Approve
                </Button>
                <Button variant="ghost" size="sm" className="rounded-xl">
                  Reject + require reason
                </Button>
                <Button variant="ghost" size="sm" className="rounded-xl">
                  View audit trail
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-white/10 bg-black/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Approve / Reject vendor accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/70">
            <p>Review compliance packets, partner endorsements, and performance history.</p>
            <Button variant="secondary" className="rounded-xl">
              Launch review
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-primary" />
              Suspend / reinstate vendors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/70">
            <p>Pause accounts for investigations or automatically reinstate once issues are resolved.</p>
            <Button variant="secondary" className="rounded-xl">
              Manage statuses
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Bulk messaging
          </CardTitle>
          <CardDescription className="text-white/70">Region-level announcements.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <textarea
            className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/70"
            rows={4}
            placeholder="Share upcoming maintenance windows, policy changes, or marketing programs."
          />
          <Button className="rounded-xl">Send message</Button>
        </CardContent>
      </Card>
    </div>
  );
}
