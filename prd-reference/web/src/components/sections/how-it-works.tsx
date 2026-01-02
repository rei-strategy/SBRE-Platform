"use client";

import { ArrowRightCircle, GitBranch, Gauge } from "lucide-react";

const steps = [
  {
    title: "1. Connect & Verify",
    body: "Upload your profile, compliance, and proof of work to earn the SBRE Verified badge. Clients unlock a living roster instantly.",
    icon: ArrowRightCircle,
  },
  {
    title: "2. Engage & Route",
    body: "Requests, referrals, and inbound leads travel through automated routing so the right vendor responds first every time.",
    icon: GitBranch,
  },
  {
    title: "3. Scale & Measure",
    body: "Track outcomes, revenue, and relationships with shared telemetry so both sides of the network scale with confidence.",
    icon: Gauge,
  },
];

export function HowItWorksSection() {
  return (
    <section className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-[90rem] rounded-[36px] border border-white/10 bg-black/60 p-10 shadow-[0_30px_90px_rgba(2,6,23,0.7)] backdrop-blur-2xl">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
          How SBRE Works
        </p>
        <h2 className="mt-4 text-center text-3xl font-semibold text-white md:text-4xl">
          SBRE Connect™ unites visibility + reliability + automation so both sides of the market grow
          faster.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-white/80 backdrop-blur transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm text-white/70">{step.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
