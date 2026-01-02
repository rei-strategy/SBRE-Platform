"use client";

import { ShieldCheck, Compass, LineChart, Cpu } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const valueProps = [
  {
    icon: ShieldCheck,
    title: "PROBLEM",
    body: "Disconnected systems. Slow responses. Wasted opportunities. Operators lose momentum when vendor intel lives everywhere and nowhere.",
  },
  {
    icon: Compass,
    title: "SOLUTION",
    body: "SBRE Connect™ brings every vendor, client, and lead into one automated ecosystem — verified, trackable, and scalable.",
  },
  {
    icon: LineChart,
    title: "SBRE CONNECT™",
    body: "Your hub for verified connections — discover trusted partners, get verified yourself, and manage every deal from one live map.",
  },
  {
    icon: Cpu,
    title: "AUTOMATED VISIBILITY",
    body: "Trust, automation, and visibility combine so both sides of the market grow faster together.",
  },
];

export function ValueGrid() {
  return (
    <section className="relative -mt-6 px-6 pb-24 pt-12 md:-mt-10 md:px-12 md:pt-20" id="network">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[rgba(15,23,42,0.85)] via-[rgba(15,23,42,0.6)] to-transparent"
      />
      <div className="relative mx-auto max-w-[90rem]">
        <div className="mb-14 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
            Build Your Verified Vendor Network
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
            Join SBRE Connect™ — a map-based marketplace powered by trust.
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Because real estate is small business. We unify partners through automation and
            visibility so every opportunity is captured at the speed of local commerce.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {valueProps.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.title}
                className="h-full bg-gradient-to-br from-white/5 via-card to-card/80 transition-transform duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription className="text-base text-white/70">
                    {item.body}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2 text-sm text-white/60">
                  Hover to feel the lift—subtle depth cues reinforce the premium craft behind every
                  interaction.
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
