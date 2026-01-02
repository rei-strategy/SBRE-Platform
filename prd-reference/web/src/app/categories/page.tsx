"use client";

import { motion } from "framer-motion";
import { Search, Sliders } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const categories = [
  "Realtors",
  "Contractors",
  "Lenders",
  "Inspectors",
  "Photographers",
  "Property Managers",
  "Cleaning Crews",
  "Stagers",
  "Appraisers",
  "Solar Installers",
  "Landscapers",
  "Logistics & FF&E",
];

const filters = ["All", "Verified", "Elite", "Fast Response", "Minority-Owned", "New Additions"];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-[#05080f] text-white">
      <section className="mx-auto max-w-[90rem] px-6 py-20 md:px-12 md:py-28">
        <div className="max-w-4xl">
          <p className="text-sm uppercase tracking-[0.4em] text-white/70">Public Preview</p>
          <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
            Browse verified categories across the SBRE map.
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Peek into the vendor universe before you join. Every tile represents an active supply-side network
            ready for operators and small-business teams.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-primary hover:text-primary"
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <Search className="h-5 w-5 text-white/60" />
          <input
            placeholder="Search categories, tags, or specialties"
            className="flex-1 bg-transparent text-base text-white placeholder:text-white/50 focus:outline-none"
          />
          <button className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/70">
            <Sliders className="h-4 w-4" />
            Filters
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-[90rem] px-6 pb-20 md:px-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full border-white/10 bg-gradient-to-br from-white/5 via-black/60 to-black/70 shadow-[0_20px_70px_rgba(3,7,18,0.8)]">
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                  <CardDescription className="text-white/70">
                    Live vendors • Coverage heatmaps • Lead availability
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-white/70">
                  <p>
                    Preview top performers, see badge tiers, and understand demand before creating a shortlist.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-white/60">
                    <span className="rounded-full border border-white/20 px-3 py-1">Verified</span>
                    <span className="rounded-full border border-white/20 px-3 py-1">Elite</span>
                    <span className="rounded-full border border-white/20 px-3 py-1">On Map</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}

