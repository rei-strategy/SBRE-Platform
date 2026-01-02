"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, Coins, Crown, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const benefits = [
  {
    icon: Shield,
    title: "Trust-as-a-service",
    description:
      "Badges aren't static. SBRE automates renewals, background checks, and document alerts so you stay verified without fire drills.",
  },
  {
    icon: Coins,
    title: "Monetize momentum",
    description:
      "Unlock Featured Placement boosts, category add-ons, and demand alerts to convert idle capacity into booked work.",
  },
  {
    icon: Crown,
    title: "Elite vendor status",
    description:
      "Win Elite badge eligibility with NPS, response times, and SLAs. Operators filter for Elite when routing priority work.",
  },
];

const badges = [
  {
    tier: "Verified",
    color: "from-emerald-400/60 to-emerald-500/20",
    points: ["License + insurance validated", "Identity + compliance checks", "Profile completion score > 70%"],
  },
  {
    tier: "Pro",
    color: "from-sky-400/60 to-sky-500/20",
    points: ["Response time under 5 min", "Reviews 4.6+ with recency", "Connected platform / automations enabled"],
  },
  {
    tier: "Elite",
    color: "from-fuchsia-400/60 to-fuchsia-500/20",
    points: ["Top 5% conversion + retention", "High demand coverage zones", "SBRE advisory invites & pilots"],
  },
];

export default function VendorBenefitsPage() {
  return (
    <main className="min-h-screen bg-[#04070d] text-white">
      <section className="mx-auto max-w-[90rem] px-6 py-20 md:px-12 md:py-28">
        <p className="text-sm uppercase tracking-[0.4em] text-white/70">For vendors</p>
        <div className="grid gap-12 md:grid-cols-[1.1fr,0.9fr]">
          <div>
            <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
              Join the only verified marketplace built for vendor revenue, not just directories.
            </h1>
            <p className="mt-6 text-lg text-white/70">
              SBRE Connect™ gives you trust badges, automated routing, and monetization tools so operators know exactly
              who to call and why. Your profile becomes a living, measurable asset.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" className="group" asChild>
                <a href="/signup">
                  Claim your badge
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-1" />
                </a>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <a href="/how-it-works">See the process</a>
              </Button>
            </div>
          </div>
          <Card className="border-white/10 bg-gradient-to-br from-white/5 via-black/60 to-black/60 shadow-[0_30px_90px_rgba(5,10,25,0.7)]">
            <CardHeader>
              <CardDescription className="text-white/70">Monetization snapshot</CardDescription>
              <CardTitle className="text-4xl font-semibold">+$38k</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-white/70">
              <p>Average incremental revenue captured by SBRE Pro vendors in the first 6 months.</p>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Add-on mix</p>
                <ul className="mt-3 space-y-2">
                  <li className="flex justify-between">
                    <span>Featured Placement Boosts</span>
                    <span className="text-white">42%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Category Boost Packs</span>
                    <span className="text-white">33%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Expanded Coverage</span>
                    <span className="text-white">25%</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-[90rem] px-6 pb-16 md:px-12">
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="h-full border-white/10 bg-black/60">
                  <CardHeader>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{benefit.title}</CardTitle>
                    <CardDescription className="text-white/70">{benefit.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[90rem] px-6 pb-24 md:px-12">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_30px_90px_rgba(5,10,25,0.7)] md:p-12">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Badge System</p>
          <h2 className="mt-4 text-3xl font-semibold">Verification levels that actually matter to buyers.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {badges.map((badge) => (
              <div key={badge.tier} className="rounded-[24px] border border-white/10 bg-black/50 p-6">
                <div className={`inline-flex items-center rounded-full bg-gradient-to-r ${badge.color} px-4 py-1 text-sm font-semibold`}>
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  {badge.tier}
                </div>
                <ul className="mt-6 space-y-3 text-sm text-white/70">
                  {badge.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
