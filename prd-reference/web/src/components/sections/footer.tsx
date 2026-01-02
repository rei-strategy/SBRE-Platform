import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

import { Marquee } from "@/components/ui/marquee";

export function SiteFooter() {
  return (
    <footer className="px-6 pb-10 pt-16 md:px-12">
      <div className="mx-auto max-w-[90rem] rounded-[32px] border border-white/10 bg-black/60 p-10 shadow-[0_20px_80px_rgba(2,6,23,0.7)] backdrop-blur-2xl">
        <div className="text-center text-white/70">
          <Marquee />
          <h3 className="mt-6 text-2xl font-semibold text-white">🚀 Join the SBRE Network Now</h3>
        </div>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">HOURS</p>
            <p className="mt-3 text-white/80">
              Mon: CLOSED
              <br />
              Tue to Fri: 11 AM – 10 PM
              <br />
              Sat to Sun: 12 PM – 7 PM
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">FIND US</p>
            <p className="mt-3 text-white/80">
              123 Demo St, New York, NY
              <br />
              (555) 555-5555
              <br />
              email@example.com
            </p>
            <div className="mt-4 flex gap-3">
              <Link
                href="#"
                aria-label="Follow on Twitter"
                className="rounded-full border border-white/20 p-2 text-white/70 transition hover:border-primary hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                aria-label="Connect on LinkedIn"
                className="rounded-full border border-white/20 p-2 text-white/70 transition hover:border-primary hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                aria-label="View GitHub"
                className="rounded-full border border-white/20 p-2 text-white/70 transition hover:border-primary hover:text-primary"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
              SITEMAP
            </p>
            <nav className="mt-3 space-y-2 text-white/80">
              <Link href="/" className="block hover:text-primary">
                Home
              </Link>
              <Link href="/shared/terms" className="block hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/shared/terms#privacy" className="block hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="https://cmp.example.com" className="block hover:text-primary">
                Cookie & CMP
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-sm text-white/60">
          © {new Date().getFullYear()} SBRE Networks. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
