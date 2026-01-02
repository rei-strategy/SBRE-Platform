"use client";

import { Globe2, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tools = [
  {
    title: "Multi-market profiles",
    description: "Clone your verified profile into new metros while keeping compliance intact.",
  },
  {
    title: "Team accounts",
    description: "Invite teammates with role-based permissions and assign routing responsibilities.",
  },
  {
    title: "API integrations",
    description: "Connect SBRE data into your systems via REST, GraphQL, or Snowflake events.",
  },
  {
    title: "SBRE Cloud Apps",
    description: "Install add-ons like Incident Forms, QA checklists, and partner workflows.",
  },
  {
    title: "Expansion templates",
    description: "Use SBRE’s regional playbooks to move faster in new markets.",
  },
];

export default function ExpansionToolsPage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Step 9 · Expansion</p>
        <h1 className="mt-2 text-3xl font-semibold">Scale playbooks.</h1>
        <p className="text-white/70">
          Unlock multi-market visibility, team controls, and API integrations to expand without losing trust.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.title} className="border-white/10 bg-black/60">
            <CardHeader>
              <CardTitle>{tool.title}</CardTitle>
              <CardDescription className="text-white/70">{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="rounded-xl">
                Explore
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-primary" />
            Expansion wizard
          </CardTitle>
          <CardDescription className="text-white/70">
            Step-by-step guide to launching in a new region.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {[
            { label: "Select target markets", detail: "Dallas, Phoenix, Nashville" },
            { label: "Assign team owners", detail: "Marcus Lee, Sarah Patel" },
            { label: "Template pack", detail: "Retail multi-market playbook" },
            { label: "Go-live date", detail: "May 15" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-sm text-white/60">{item.label}</p>
              <p className="mt-2 text-lg font-semibold">{item.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            SBRE support
          </CardTitle>
          <CardDescription className="text-white/70">
            Schedule time with our expansion architects for co-selling or co-marketing support.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="rounded-xl" variant="ghost">
            Book a session
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
