"use client";

import { useState } from "react";
import { ArrowRight, Building2, Factory, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const accountTypes = [
  {
    id: "vendor",
    title: "Vendor Account",
    description: "Contractors, lenders, inspectors, creatives, and field teams joining the verified marketplace.",
    icon: Factory,
  },
  {
    id: "operator",
    title: "Business / Operator",
    description: "Property managers, investors, franchise leads, and service coordinators sourcing trusted partners.",
    icon: Building2,
  },
  {
    id: "enterprise",
    title: "Enterprise Partner",
    description: "Regional directors and platform teams orchestrating multi-market playbooks.",
    icon: Sparkles,
  },
];

export default function SignupPage() {
  const [type, setType] = useState(accountTypes[0].id);

  return (
    <main className="min-h-screen bg-[#03060d] text-white">
      <section className="mx-auto max-w-[90rem] px-6 py-20 md:px-12 md:py-28">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.4em] text-white/70">Create account</p>
          <h1 className="mt-4 text-4xl font-semibold md:text-5xl">Choose your SBRE Connect™ schema.</h1>
          <p className="mt-4 text-lg text-white/70">
            Whether you’re a vendor building verified trust, a business sourcing at scale, or an enterprise lead, this flow
            gets you visible fast.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {accountTypes.map((acct) => {
            const Icon = acct.icon;
            return (
              <button
                key={acct.id}
                className={`rounded-[28px] border p-6 text-left transition ${
                  type === acct.id ? "border-primary bg-primary/10" : "border-white/10 bg-white/5 hover:border-primary/60"
                }`}
                onClick={() => setType(acct.id)}
                type="button"
              >
                <Icon className="h-6 w-6 text-primary" />
                <p className="mt-4 text-lg font-semibold">{acct.title}</p>
                <p className="mt-2 text-sm text-white/70">{acct.description}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.1fr,0.9fr]">
          <Card className="border-white/10 bg-black/60">
            <CardHeader>
              <CardTitle className="text-2xl">Create credentials</CardTitle>
              <CardDescription className="text-white/70">
                Tell us who you are. We’ll route you to the correct onboarding wizard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input placeholder="Full name" />
              <Input type="email" placeholder="Work email" />
              <Input placeholder="Mobile phone" />
              <Input placeholder="Company / Organization" />
              <Input type="password" placeholder="Create password" />
              <Button className="w-full rounded-2xl">
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-gradient-to-br from-white/10 via-black/40 to-black/50">
            <CardHeader>
              <CardDescription className="text-white/70">After signup</CardDescription>
              <CardTitle>1. Verify → 2. Visible → 3. Connected</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-white/70">
              <p>We’ll ask for licenses/insurance, coverage details, and routing preferences. Expect ~5 min per step.</p>
              <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Why phone & email?</p>
                <p className="mt-2">
                  Instant alerting, SLA timers, and compliance updates rely on confirmed contact channels. Accuracy prevents
                  routing delays.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

