"use client";

import { ArrowUpRight, CreditCard, Receipt, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const permissions = [
  { role: "Admin", detail: "Full access" },
  { role: "Manager", detail: "Can create projects, manage vendors" },
  { role: "Viewer", detail: "Read-only access" },
];

const invoices = [
  "Invoice #4021 · Paid · $1,200 · Mar 4",
  "Invoice #3985 · Paid · $980 · Feb 4",
  "Invoice #3930 · Paid · $980 · Jan 4",
];

const trials = [
  { plan: "Operator Plus", ends: "May 28", paymentMethod: "Visa •• 4242", tokenized: true, dunning: "clear" },
  { plan: "Operator Core", ends: "Jun 12", paymentMethod: "ACH •• 6789", tokenized: true, dunning: "at-risk" },
];

const refunds = [
  { id: "#R-1043", amount: "$180 (partial)", reason: "Service outage credit", status: "Recorded + emailed" },
  { id: "#R-1029", amount: "$980 (full)", reason: "Duplicate order", status: "Ledger + email confirmation" },
];

export default function OperatorBillingPage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Billing & Subscription</p>
        <h1 className="mt-2 text-3xl font-semibold">Manage operator access + payments.</h1>
        <p className="text-white/70">
          Operator-level billing, invoices, and team permissions centralized in one pane.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Trial + payment method
            </CardTitle>
            <CardDescription className="text-white/70">
              Start trials, tokenize cards/ACH, and store dunning posture.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {trials.map((trial) => (
              <div key={trial.plan} className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/70">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">{trial.plan}</p>
                    <p className="text-xs text-white/60">Trial ends {trial.ends}</p>
                  </div>
                  <span className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60">
                    {trial.dunning === "at-risk" ? "dunning" : "clear"}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs">{trial.paymentMethod}</span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs">
                    {trial.tokenized ? "Tokenized" : "Add payment method"}
                  </span>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-3">
              <Button className="rounded-xl">Add card</Button>
              <Button variant="secondary" className="rounded-xl">
                Start trial
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-primary" />
              Subscription lifecycle
            </CardTitle>
            <CardDescription className="text-white/70">Proration previews, mid-cycle changes, and renewals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/70">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-white">Upgrade: Plus → Elite</p>
              <p className="text-xs text-white/60">Prorated credit + new charge previewed before confirm.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-white">Downgrade protection</p>
              <p className="text-xs text-white/60">Effective next cycle; shows mid-period refund estimate.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-white">Edge-date tests</p>
              <p className="text-xs text-white/60">Proration unit-tested around month-end/short months before confirm.</p>
            </div>
            <Button variant="secondary" className="rounded-xl">
              Preview proration
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Team-level permissions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {permissions.map((role) => (
            <div key={role.role} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-lg font-semibold">{role.role}</p>
              <p className="text-sm text-white/70">{role.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Invoices, refunds, and receipts
          </CardTitle>
          <CardDescription className="text-white/70">
            Stripe-managed billing with partial/full refunds and email confirmations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-white/70">
          <div className="grid gap-3 md:grid-cols-2">
            {invoices.map((invoice) => (
              <div key={invoice} className="rounded-2xl border border-white/10 bg-black/40 p-3">
                {invoice}
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="text-white">Refunds (partial/full)</p>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              {refunds.map((refund) => (
                <div key={refund.id} className="rounded-xl border border-white/10 bg-black/30 p-3">
                  <p className="font-semibold text-white">{refund.id}</p>
                  <p className="text-xs text-white/60">{refund.amount}</p>
                  <p className="text-xs text-white/60">{refund.reason}</p>
                  <p className="text-xs text-white/60">{refund.status}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/60">
              <span className="rounded-full border border-white/15 px-3 py-1">Reason required</span>
              <span className="rounded-full border border-white/15 px-3 py-1">Audit trail + ledger reversal</span>
              <span className="rounded-full border border-white/15 px-3 py-1">Email confirmation sent</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="rounded-xl">Issue refund</Button>
            <Button variant="secondary" className="rounded-xl">
              Download invoice PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
