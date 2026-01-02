"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const logos = [
  "SummitFund",
  "Hearthstone Living",
  "Peakstone Partners",
  "Latitude CRE",
  "Northwind Retail",
  "NovaWorks",
];

const testimonials = [
  {
    quote:
      "SBRE Connect delivers vendor shortlists before our internal sourcing team finishes scoping. Their diligence pack lets compliance approve within hours.",
    author: "Taylor Chen",
    title: "Director of Facilities, Northwind Retail",
    rating: 5,
  },
  {
    quote:
      "The combination of real analysts and living telemetry means we can scale seasonal programs without compromising standards or diversity goals.",
    author: "Anita Flores",
    title: "VP of Operations, Hearthstone Living",
    rating: 5,
  },
  {
    quote:
      "We pipe SBRE data into Snowflake to forecast vendor capacity and cash flow. It’s the smartest operations upgrade we made this year.",
    author: "Marcus Lee",
    title: "Procurement Lead, Peakstone Partners",
    rating: 5,
  },
];

export function SocialProof() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const active = testimonials[index];

  return (
    <section className="px-6 py-24 md:px-12">
      <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
            Trusted by category leaders
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
            Social proof sourced from real momentum.
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Display logos with balanced contrast and breathing room. Each tile leans on subtle glass
            morphism for a refined presentation.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {logos.map((logo) => (
              <motion.div
                key={logo}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-white/5 bg-white/5 px-6 py-8 text-center text-sm font-semibold tracking-wide text-white/80 shadow-[0_10px_30px_rgba(2,6,23,0.45)] backdrop-blur"
              >
                {logo}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/5 via-white/2 to-black/60 p-10 shadow-[0_40px_120px_rgba(2,6,23,0.65)] backdrop-blur-2xl">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 text-amber-300"
                fill="currentColor"
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="mt-3 text-sm uppercase tracking-[0.3em] text-white/60">Testimonials</p>
          <div className="mt-6 min-h-[180px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={active.author}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-2xl leading-relaxed text-white"
              >
                “{active.quote}”
              </motion.blockquote>
            </AnimatePresence>
          </div>
          <p className="mt-6 text-lg font-semibold text-white">{active.author}</p>
          <p className="text-sm text-white/70">{active.title}</p>
          <div className="mt-8 flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Previous testimonial"
              onClick={() => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Next testimonial"
              onClick={() => setIndex((prev) => (prev + 1) % testimonials.length)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <div className="ml-auto flex gap-2">
              {testimonials.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 w-8 rounded-full transition-all ${
                    i === index ? "bg-primary" : "bg-white/20"
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
