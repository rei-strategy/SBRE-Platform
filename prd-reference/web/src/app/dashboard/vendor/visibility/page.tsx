"use client";

import { MapPinned, Search, Wand2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const keywords = ["Retail build-out", "Tenant improvements", "ADA compliance", "Emergency response"];

export default function VisibilityPage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Step 3 · Get Found & Chosen</p>
        <h1 className="mt-2 text-3xl font-semibold">Marketplace visibility</h1>
        <p className="text-white/70">
          Optimize your search appearance, keyword mix, and geographic demand overlays to climb the SBRE map.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Keyword optimization
            </CardTitle>
            <CardDescription className="text-white/70">
              Keywords with strong operator demand get highlighted here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {keywords.map((keyword) => (
              <Input key={keyword} defaultValue={keyword} />
            ))}
            <button className="text-sm text-primary">Add keyword</button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              Ranking criteria
            </CardTitle>
            <CardDescription className="text-white/70">
              What influences search placement in SBRE Connect™.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/70">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3">Badge level weight (40%)</div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3">Response time + SLA streak (25%)</div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3">Keyword relevance (20%)</div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3">Reviews & engagement (15%)</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinned className="h-5 w-5 text-primary" />
            Map preview & visibility heatmap
          </CardTitle>
          <CardDescription className="text-white/70">
            High-demand neighborhoods glow brighter. Hover on the real app to view stats; preview simplified here.
          </CardDescription>
        </CardHeader>
        <CardContent className="rounded-3xl border border-white/10 bg-gradient-to-br from-primary/10 via-slate-900/60 to-black p-12 text-center text-white/60">
          Interactive map preview placeholder
        </CardContent>
      </Card>
    </div>
  );
}

