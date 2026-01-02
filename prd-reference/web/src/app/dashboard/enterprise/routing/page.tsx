"use client";

import { Globe2, Layers, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EnterpriseRoutingPage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Enterprise Routing Rules</p>
        <h1 className="mt-2 text-3xl font-semibold">Define cross-region automation.</h1>
        <p className="text-white/70">
          Create custom SLAs, enterprise review templates, and escalation matrices that cascade across every market.
        </p>
      </header>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-primary" />
            Cross-region routes
          </CardTitle>
          <CardDescription className="text-white/70">
            Example: Texas routes overflow to Southeast region.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-white/70">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            Texas → Southeast overflow (contractors)
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            West Coast → Intermountain (lenders)
          </div>
          <Button variant="secondary" className="rounded-xl">
            Add route
          </Button>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Custom SLAs + review templates
          </CardTitle>
          <CardDescription className="text-white/70">Adjust for enterprise partners.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {["Response SLA: 4m for Platinum accounts", "Review template: Enterprise voice", "Escalation matrix: Tier 1 > Tier 2 > SBRE"].map(
            (item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/70">
                {item}
              </div>
            ),
          )}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Escalation matrix
          </CardTitle>
          <CardDescription className="text-white/70">
            Determine who handles issues at each tier.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3 text-sm text-white/70">
          {[
            { tier: "Tier 1", action: "Vendor success team" },
            { tier: "Tier 2", action: "Regional director" },
            { tier: "Tier 3", action: "SBRE trust & safety" },
          ].map((tier) => (
            <div key={tier.tier} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-lg font-semibold text-white">{tier.tier}</p>
              <p>{tier.action}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

