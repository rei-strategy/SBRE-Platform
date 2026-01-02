"use client";

import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Eye, Network } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const flows = [
  {
    title: "Step 01 · Verified",
    icon: BadgeCheck,
    description:
      "Every vendor completes the SBRE verification loop—licenses, insurance, identity, and live compliance monitoring refresh automatically.",
    bullets: ["License + insurance automation", "Identity + background checks", "Badge tiers (Verified, Pro, Elite)"],
  },
  {
    title: "Step 02 · Visible",
    icon: Eye,
    description:
      "Approved vendors surface on the SBRE live map with rich profiles, coverage overlays, and keyword-optimized listings that buyers can trust.",
    bullets: ["Map-based presence", "Keyword coaching + SEO hints", "Coverage heatmaps + demand alerts"],
  },
  {
    title: "Step 03 · Connected",
    icon: Network,
    description:
      "Requests, automations, and reviews keep the flywheel spinning. Vendors win vetted work while operators get faster, safer execution.",
    bullets: ["Automated routing + SLAs", "Lead inbox + SMS threads", "Performance analytics + billing"],
  },
];

const milestones = [
  { label: "Verification Completion", value: "89%" },
  { label: "Average Time to Visible", value: "72 hrs" },
  { label: "Connected Deals / Month", value: "4.6" },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#060910] via-[#0b1221] to-[#060910] text-white">
      <section className="relative mx-auto max-w-[90rem] px-6 py-20 md:px-12 md:py-28">
        <div className="max-w-4xl">
          <p className="text-sm uppercase tracking-[0.4em] text-white/70">How It Works</p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">
            Verified → Visible → Connected.
            <br />
            One motion, nine checkpoints, zero guesswork.
          </h1>
          <p className="mt-6 text-lg text-white/70">
            SBRE Connect™ is a performance flywheel. Vendors move through guided steps that unlock visibility,
            while operators gain real-time transparency, routing, and collaboration tools. No slideshows—just a living system.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" className="group" href="/vendor-benefits" asChild>
              <a>
                Explore vendor path
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <a href="/pricing">View pricing</a>
            </Button>
          </div>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {milestones.map((item) => (
            <Card
              key={item.label}
              className="bg-white/5 text-white shadow-[0_10px_60px_rgba(8,16,32,0.5)] backdrop-blur-2xl"
            >
              <CardHeader>
                <CardDescription className="uppercase tracking-[0.3em] text-white/60">
                  {item.label}
                </CardDescription>
                <CardTitle className="text-3xl font-semibold">{item.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[90rem] px-6 pb-24 md:px-12">
        <div className="grid gap-8 md:grid-cols-3">
          {flows.map((flow, index) => {
            const Icon = flow.icon;
            return (
              <motion.div
                key={flow.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <Card className="h-full border-white/10 bg-black/50 shadow-[0_20px_70px_rgba(3,7,18,0.9)]">
                  <CardHeader className="space-y-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{flow.title}</CardTitle>
                    <CardDescription className="text-white/70">{flow.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-white/70">
                      {flow.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

