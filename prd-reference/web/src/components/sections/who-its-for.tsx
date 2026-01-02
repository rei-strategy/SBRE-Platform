"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";

const audiences = [
  "Contractors, lenders, photographers, cleaning crews, inspectors.",
  "Property managers, investors, franchise owners, and service coordinators.",
  "Business leaders managing multi-region teams and partnerships.",
];

export function AudienceSection() {
  return (
    <section className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-[90rem]">
        <div className="rounded-[40px] border border-white/10 bg-gradient-to-br from-white/5 via-black/40 to-black/80 p-10 shadow-[0_30px_80px_rgba(2,6,23,0.65)] backdrop-blur-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
            WHO IT’S FOR
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
            SBRE is for every operator who treats community-scale work like a flagship enterprise.
          </h2>
          <div className="mt-10 space-y-6">
            {audiences.map((item, index) => (
              <motion.div
                key={item}
                className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 backdrop-blur"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-white/60">
                  <Users className="h-4 w-4 text-primary" />
                  Community operators
                </div>
                <p className="text-lg text-white">{item}</p>
                <p className="text-sm text-white/70">{item}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-10 text-sm uppercase tracking-[0.3em] text-primary">
            SIGN UPSIGN UPSIGN UP · SIGN UP
          </p>
        </div>
      </div>
    </section>
  );
}
