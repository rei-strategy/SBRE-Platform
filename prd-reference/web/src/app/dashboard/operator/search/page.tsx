"use client";

import { Filter, Gauge, Map, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const filters = ["Rating 4.5+", "Availability: Next 7 days", "Category: Contractors", "Coverage: 25mi radius"];
const buyerFilters = ["Price: $500-$2,000", "Category: Restoration", "Badges: Verified / Elite", "Availability: In 48h"];

export default function OperatorSearchPage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Search & Map Interface</p>
        <h1 className="mt-2 text-3xl font-semibold">Discover vetted vendors anywhere.</h1>
        <p className="text-white/70">
          Map pins, filters, bulk requests, coverage heatmaps, and live status—previewed here for concept.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filters
            </CardTitle>
            <CardDescription className="text-white/70">
              Combine rating, availability, price, and category filters before bulk requesting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Search locations, vendors, or services" />
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 hover:border-primary hover:text-primary"
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {buyerFilters.map((filter) => (
                <span
                  key={filter}
                  className="rounded-full border border-white/15 px-3 py-2 text-xs uppercase tracking-[0.25em] text-white/60"
                >
                  {filter}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" className="rounded-xl">
                Save filter
              </Button>
              <Button className="rounded-xl">Apply pagination</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Marketplace checkout readiness
            </CardTitle>
            <CardDescription className="text-white/70">
              Search → add to cart → checkout → receipt with persistent order + payment intent IDs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/70">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
              Cart persists between sessions; availability re-checks at handoff to checkout.
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
              Payment intents idempotent; receipt emailed with order ID + tax breakdown.
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
              Tax calculated per jurisdiction; receipt includes invoice link for finance.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            Map + coverage heatmap
          </CardTitle>
          <CardDescription className="text-white/70">
            Example gradient overlay showing demand pinnacles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-primary/10 via-slate-900/60 to-black p-12 text-center text-white/60">
            Interactive map placeholder (pins + heatmap)
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-white/70">
            <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">Multi-vendor bulk request</div>
            <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">Real-time vendor status (online / on-site)</div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-primary" />
            Performance & pagination
          </CardTitle>
          <CardDescription className="text-white/70">
            Staging p95 &lt; 300 ms enforced with cached searches, cursor-based pagination, and filter analytics.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3 text-sm text-white/70">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            p95 search latency <span className="font-semibold text-white">260 ms</span> (staging)
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            Pagination: cursor-based, page size 25, prefetch next page
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            Filters: price, category, badge, availability, coverage radius
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
