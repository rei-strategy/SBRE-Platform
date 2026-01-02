"use client";

import { CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const invoices = [
  "Invoice #5012 · Paid · $980 · Apr 1",
  "Invoice #4920 · Paid · $980 · Mar 1",
  "Invoice #4834 · Paid · $980 · Feb 1",
];

export default function SharedBillingPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Billing & Subscription</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Manage your SBRE plan.</h1>
        <p className="text-white/70">Available to all roles with appropriate permissions.</p>
      </header>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <CreditCard className="h-5 w-5 text-primary" />
            Subscription details
          </CardTitle>
          <CardDescription className="text-white/70">Plan: SBRE Plus · $980/mo · Stripe</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button className="rounded-xl">Open billing portal</Button>
          <Button variant="secondary" className="rounded-xl">
            Download latest invoice
          </Button>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="text-white">Invoice history</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-white/70">
          {invoices.map((invoice) => (
            <div key={invoice} className="rounded-2xl border border-white/10 bg-black/40 p-3">
              {invoice}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

