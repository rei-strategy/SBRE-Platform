"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Menu, Sparkles } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";

const stats = [
  { label: "Verified vendor partners", value: "1,400+" },
  { label: "Cities on the live map", value: "300+" },
  { label: "Avg. onboarding time", value: "7 days" },
];

export function HeroSection() {
  return (
    <section className="relative z-0 overflow-hidden px-6 pb-24 pt-16 md:px-12" id="hero">
      <div className="relative mx-auto max-w-[90rem] rounded-[40px] border border-white/15 bg-gradient-to-br from-white/5 via-white/2 to-white/5 px-6 py-16 shadow-[0_40px_120px_rgba(2,6,23,0.65)] backdrop-blur-2xl md:px-16">
        <Noise />
        <GradientOrbs />
        <div className="flex flex-col justify-between gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 md:flex-row md:items-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            SBRE Connect™
          </motion.span>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap items-center gap-3 text-white/60"
          >
            <Menu className="h-4 w-4 text-primary" /> Menu
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <Calendar className="h-4 w-4 text-primary" /> Reservations
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 text-center text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl md:text-left"
        >
          <span className="bg-gradient-to-r from-sky-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            BECAUSE REAL ESTATE
          </span>{" "}
          is small business.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-center text-lg text-white/80 md:max-w-3xl md:text-left"
        >
          Build your verified vendor network. Join SBRE Connect™, the only map-based marketplace that
          unites real-estate and small-business professionals through trust, automation, and
          visibility.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start"
        >
          <Button size="lg" className="group">
            SIGN UP HERE
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
          <Button size="lg" variant="ghost" className="backdrop-blur">
            See our nETWORK!
          </Button>
        </motion.div>

        <div className="mt-16 grid gap-6 text-left sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-white/80 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 hover:border-white/30"
            >
              <p className="text-sm uppercase tracking-[0.2em] text-white/60">{stat.label}</p>
              <p className="mt-3 text-2xl font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, duration: 0.6, type: "spring" }}
          className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-black/30 shadow-inner backdrop-blur-2xl"
        >
          <div className="grid gap-0 md:grid-cols-2">
            <div className="px-8 py-10 text-left">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">
                Build Your Verified Vendor Network
              </p>
              <p className="mt-4 text-3xl font-semibold text-white">
                SBRE Connect™ brings every vendor, client, and lead into one automated ecosystem —
                verified, trackable, and scalable.
              </p>
              <p className="mt-4 text-white/70">
                Your hub for verified connections: discover trusted partners, get verified yourself,
                and manage every deal from one live map.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-white/70">
                <MapPin className="h-5 w-5 text-primary" />
                <Marquee />
              </div>
            </div>
            <div className="relative min-h-[280px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1600&q=80"
                alt="Operators reviewing SBRE vendor routes on a tablet"
                width={1600}
                height={1066}
                className="h-full w-full object-cover object-center opacity-90"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/10 via-slate-900/20 to-slate-900/60" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Noise() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-30 mix-blend-soft-light"
      aria-hidden
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cg fill='none' fill-opacity='0.4'%3E%3Cpath d='M0 160h20L0 0z'/%3E%3Cpath d='M40 160h20L40 0z'/%3E%3Cpath d='M80 160h20L80 0z'/%3E%3Cpath d='M120 160h20L120 0z'/%3E%3C/g%3E%3C/svg%3E\")",
      }}
    />
  );
}

function GradientOrbs() {
  return (
    <>
      <div
        className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full bg-gradient-to-br from-primary/30 via-accent/40 to-white/10 blur-3xl animate-float-slow"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-transparent blur-3xl animate-float-slow"
        aria-hidden
      />
    </>
  );
}
