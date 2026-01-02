"use client";

import { AlertOctagon, AlertTriangle, BadgeCheck, Banknote, CheckCircle2, FileCheck2, FileWarning, Fingerprint, Shield } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const items = [
  { title: "Upload licenses", status: "Expires in 22 days", icon: FileCheck2 },
  { title: "Upload insurance", status: "Verified · Aon", icon: Shield },
  { title: "Identity verification", status: "Completed", icon: Fingerprint },
  { title: "Background check", status: "Not required", icon: AlertTriangle },
  { title: "Renewal tracking", status: "2 documents expiring soon", icon: FileWarning },
];

const badges = [
  { tier: "Verified", description: "Base trust requirement; required for map visibility." },
  { tier: "Pro", description: "Track SLAs + integrate the platform to earn this badge." },
  { tier: "Elite", description: "Top 5% of vendors; includes spotlight placement." },
];

const payouts = [
  { label: "KYC/KYB status", value: "In review (passport + EIN)", icon: Shield },
  { label: "Payout account", value: "Chase •• 7791 (verified)", icon: Banknote },
  { label: "Error handling", value: "Webhook retry + Slack alert on verification failures", icon: AlertOctagon },
];

export default function VerificationPage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Step 2 · Earn Trust Badges</p>
        <h1 className="mt-2 text-3xl font-semibold">Verification Center</h1>
        <p className="text-white/70">
          Licenses, insurance, identity, background checks, and renewal alerts live here. Keep everything green to retain your badges.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="border-white/10 bg-black/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  {item.title}
                </CardTitle>
                <CardDescription className="text-white/70">{item.status}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="rounded-xl">
                  Manage
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Vendor payout onboarding
          </CardTitle>
          <CardDescription className="text-white/70">
            Set up payouts with KYC/KYB tracking, verified accounts, and resilient error handling.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {payouts.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-black/50 p-4 text-sm text-white/70">
                <div className="flex items-center gap-2 text-white">
                  <Icon className="h-5 w-5 text-primary" />
                  {item.label}
                </div>
                <p className="mt-2 text-white/80">{item.value}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-primary" />
            Badge levels
          </CardTitle>
          <CardDescription className="text-white/70">
            Each badge level increases your ranking weight and routing priority.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {badges.map((badge) => (
            <div key={badge.tier} className="rounded-2xl border border-white/10 bg-black/50 p-4">
              <p className="text-sm uppercase tracking-[0.3em] text-primary">{badge.tier}</p>
              <p className="mt-3 text-sm text-white/70">{badge.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
