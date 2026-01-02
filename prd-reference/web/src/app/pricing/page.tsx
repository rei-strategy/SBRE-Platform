"use client";

import { Check, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    name: "Basic",
    price: "$0",
    description: "Perfect for new vendors getting verified and visible.",
    features: ["Verification checklist", "Map listing preview", "Lead inbox (3/mo)", "Community support"],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$349/mo",
    description: "Unlock routing priority, automation, and analytics.",
    features: [
      "Unlimited leads + SMS routing",
      "Elite badge eligibility",
      "Platform + API integrations",
      "Performance analytics + billing portal",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For regional directors or multi-market vendor teams.",
    features: [
      "Dedicated success architect",
      "Team accounts & approvals",
      "Enterprise API + SSO",
      "Strategic placements + co-marketing",
    ],
    cta: "Book a call",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#03060c] text-white">
      <section className="mx-auto max-w-[90rem] px-6 py-20 md:px-12 md:py-28">
        <p className="text-sm uppercase tracking-[0.4em] text-white/70">Pricing</p>
        <div className="grid gap-10 md:grid-cols-[1.1fr,0.9fr]">
          <div>
            <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
              Pricing engineered for trust, throughput, and scale.
            </h1>
            <p className="mt-6 text-lg text-white/70">
              Choose the participation level that meets your roadmap. Every plan is upgradeable and backed by live
              compliance monitoring.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/60">
              <div className="rounded-full border border-white/15 px-4 py-2">Monthly or annual billing</div>
              <div className="rounded-full border border-white/15 px-4 py-2">Stripe + ACH + wires</div>
              <div className="rounded-full border border-white/15 px-4 py-2">Cancel anytime</div>
            </div>
          </div>
          <Card className="border-white/10 bg-gradient-to-br from-white/5 via-black/50 to-black/70">
            <CardHeader>
              <CardDescription className="uppercase tracking-[0.3em] text-white/60">Comparison</CardDescription>
              <CardTitle className="text-3xl font-semibold">Justify it in two calls.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-white/70">
              <p>
                SBRE Pro members report closing 1.7 incremental projects per month due to routing priority and Verified
                badges. Enterprise partners compress sourcing time by 63%.
              </p>
              <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Avg. ROI</p>
                <p className="mt-2 text-2xl font-semibold text-white">11.4x</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-[90rem] px-6 pb-24 md:px-12">
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex h-full flex-col border-white/10 ${
                plan.highlighted ? "bg-gradient-to-b from-primary/20 via-primary/5 to-black/70" : "bg-black/60"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  {plan.highlighted && (
                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em]">
                      <Sparkles className="mr-1 h-4 w-4 text-primary" /> Most Popular
                    </span>
                  )}
                </div>
                <CardDescription className="text-white/70">{plan.description}</CardDescription>
                <p className="mt-4 text-4xl font-semibold">{plan.price}</p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between">
                <ul className="space-y-3 text-sm text-white/70">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 rounded-2xl" variant={plan.highlighted ? "default" : "secondary"}>
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[90rem] px-6 pb-24 md:px-12">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 md:flex md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Need enterprise scale?</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Bring SBRE into your regional command center with custom SLAs.
            </h2>
            <p className="mt-3 text-white/70">
              Enterprise partners unlock white-glove onboarding, API limits, and region-specific launch kits.
            </p>
          </div>
          <Button size="lg" variant="ghost" className="mt-8 border border-white/30 text-white md:mt-0">
            Talk to sales
          </Button>
        </div>
      </section>
    </main>
  );
}
