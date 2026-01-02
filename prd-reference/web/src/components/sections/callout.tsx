"use client";

import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";

export function CalloutSection() {
  return (
    <section className="px-6 pb-24 md:px-12">
      <div className="mx-auto max-w-[90rem] overflow-hidden rounded-[40px] border border-white/15 bg-gradient-to-r from-indigo-500/20 via-sky-500/20 to-cyan-400/20 p-10 text-center shadow-[0_40px_120px_rgba(1,8,30,0.8)] backdrop-blur-2xl transition-transform duration-500 hover:-translate-y-2 md:flex md:items-center md:text-left">
        <div className="flex-1 overflow-hidden">
          <Marquee textClassName="text-white/70" />
          <h3 className="mt-4 text-3xl font-semibold text-white">🚀 Join the SBRE Network Now</h3>
          <p className="mt-4 text-lg text-white/80">
            Because real estate is small business. Plug into verified partners, automated routing, and
            a living marketplace built for serious operators.
          </p>
        </div>
        <div className="mt-8 flex justify-center md:mt-0 md:ml-10">
          <Button size="lg" className="group">
            SIGN UP HERE
          </Button>
        </div>
      </div>
    </section>
  );
}
