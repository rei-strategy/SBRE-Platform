"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export function ContactSection() {
  const [status, setStatus] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (!data.get("first") || !data.get("last") || !data.get("email") || !data.get("subject")) {
      setStatus("Please fill in every required field.");
      return;
    }
    setStatus("Thanks! We’ll confirm your SBRE Connect™ intro shortly.");
    form.reset();
  }

  return (
    <section className="px-6 py-24 md:px-12" id="contact">
      <div className="mx-auto max-w-[90rem] rounded-[36px] border border-white/15 bg-gradient-to-br from-black/70 to-black/40 p-10 shadow-[0_30px_90px_rgba(2,6,23,0.65)] backdrop-blur-2xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr,1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
              Name (required)
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
              Contractors, lenders, photographers, cleaning crews, inspectors.
            </h2>
            <h3 className="mt-2 text-2xl font-semibold text-white/80">
              Property managers, investors, franchise owners, and service coordinators.
            </h3>
            <h4 className="mt-2 text-xl font-semibold text-white/70">
              Business leaders managing multi-region teams and partnerships.
            </h4>
            <p className="mt-6 text-lg text-white/75">
              Tell us what coverage you need and we’ll route you to the right relationships. Because
              real estate is small business.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-white/70">
                First Name
                <input
                  className="mt-2 w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder-white/30 focus:border-primary focus:outline-none"
                  name="first"
                  required
                />
              </label>
              <label className="text-sm text-white/70">
                Last Name
                <input
                  className="mt-2 w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder-white/30 focus:border-primary focus:outline-none"
                  name="last"
                  required
                />
              </label>
            </div>
            <label className="mt-4 block text-sm text-white/70">
              Email
              <input
                type="email"
                name="email"
                required
                className="mt-2 w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder-white/30 focus:border-primary focus:outline-none"
              />
            </label>
            <label className="mt-4 block text-sm text-white/70">
              Subject
              <input
                name="subject"
                required
                className="mt-2 w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder-white/30 focus:border-primary focus:outline-none"
              />
            </label>
            <label className="mt-4 block text-sm text-white/70">
              Message
              <textarea
                name="message"
                rows={4}
                required
                className="mt-2 w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder-white/30 focus:border-primary focus:outline-none"
              />
            </label>
            <Button type="submit" className="mt-6 w-full rounded-2xl">
              Submit
            </Button>
            <p className="mt-4 text-sm text-primary">{status}</p>
            <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/50">
              SIGN UPSIGN UPSIGN UP · SIGN UP
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
