"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Layers, Lock, Workflow } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const featureTabs = [
  {
    id: "workflows",
    title: "Orchestrated workflows",
    icon: Workflow,
    description:
      "Launch sourcing moments with structured intake, collaborative notes, and automated updates feeding every stakeholder.",
    bullets: [
      "Customizable intake blueprints by asset class",
      "Inline approvals with audit-ready trails",
      "Contextual alerts across Slack and email",
    ],
  },
  {
    id: "risk",
    title: "Live risk intelligence",
    icon: Lock,
    description:
      "Compliance analysts and AI risk checks surface licensing, insurance, and financial anomalies before signatures.",
    bullets: [
      "Automated OFAC + SOS monitoring",
      "Insurance coverage deltas flagged in real time",
      "Reference-grade history with proof points",
    ],
  },
  {
    id: "systems",
    title: "Systems-grade integrations",
    icon: Layers,
    description:
      "Bi-directional sync with project tools, ERPs, and data warehouses so vendor telemetry fuels your broader stack.",
    bullets: [
      "Native connectors for Procore, NetSuite, and Monday",
      "Robust GraphQL + webhook coverage",
      "Snowflake-ready event streaming",
    ],
  },
];

export function FeatureShowcase() {
  return (
    <section className="px-6 py-24 md:px-12">
      <div className="mx-auto grid max-w-[90rem] items-center gap-12 lg:grid-cols-[1fr,0.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
            Feature spotlight
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
            Powering the entire vendor lifecycle from one elegant canvas.
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Navigate curated workflows on the left while the visualized intelligence canvas animates
            on the right. Each tab summons an ultra-smooth transition courtesy of Framer Motion.
          </p>

          <Tabs defaultValue="workflows" className="mt-8">
            <TabsList className="gap-2 bg-white/5">
              {featureTabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  <tab.icon className="mr-2 h-4 w-4" />
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {featureTabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                <motion.div
                  key={tab.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
                >
                  <p className="text-lg font-semibold text-white">{tab.title}</p>
                  <p className="mt-2 text-white/70">{tab.description}</p>
                  <ul className="mt-4 space-y-2 text-sm text-white/70">
                    {tab.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button className="group" size="lg">
              Explore product tour
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Button>
            <Button variant="ghost" size="lg">
              Download feature sheet
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          whileHover={{ y: -8, scale: 1.01 }}
        >
          <Card className="group relative overflow-hidden border-white/15 bg-black/70">
            <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -right-6 bottom-10 h-48 w-48 rounded-full bg-accent/25 blur-3xl" />
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80"
                alt="Modern workspace showcasing SBRE Connect platform"
                width={900}
                height={600}
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="h-full w-full rounded-[inherit] object-cover opacity-90 transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-8">
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">Operator feed</p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  Unified telemetry, curated recommendations, and deep context—exactly where you need
                  it.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
