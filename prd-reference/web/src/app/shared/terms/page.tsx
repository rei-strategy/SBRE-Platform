"use client";

import { CheckCircle2, FileText, Shield, ShieldCheck, ShieldQuestion, TriangleAlert } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Terms & Privacy</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Legal & compliance references.</h1>
        <p className="text-white/70">Summaries of SBRE Connect™ Terms of Service and Privacy Policy.</p>
      </header>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="h-5 w-5 text-primary" />
            Terms of service
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-white/70">
          <p>Updated: April 2025 · Revision date visible in UI.</p>
          <p>Highlights: permitted use, payment terms, liability, data handling.</p>
          <a href="/tos.pdf" className="text-primary hover:underline">
            View full ToS
          </a>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/60" id="privacy">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="h-5 w-5 text-primary" />
            Privacy policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-white/70">
          <p>Updated: April 2025 · Revision date visible in UI.</p>
          <p>Highlights: data retention, vendor data usage, compliance frameworks.</p>
          <div className="flex flex-wrap gap-3 text-xs text-white/60">
            <span className="rounded-full border border-white/15 px-3 py-1">CMP link in footer</span>
            <span className="rounded-full border border-white/15 px-3 py-1">DSR workflow draft</span>
          </div>
          <a href="/privacy.pdf" className="text-primary hover:underline">
            View full Privacy Policy
          </a>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <ShieldQuestion className="h-5 w-5 text-primary" />
            DPIA & data inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3 text-sm text-white/70">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="font-semibold text-white">Systems/fields</p>
            <p className="text-xs text-white/60">Inventory of systems, data fields, retention, processors.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="font-semibold text-white">Processing purposes</p>
            <p className="text-xs text-white/60">Mapped to lawful basis; DPIA risks tracked.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="font-semibold text-white">DSR workflow draft</p>
            <p className="text-xs text-white/60">Access/delete/export flows drafted; SLA targets defined.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <ShieldCheck className="h-5 w-5 text-primary" />
            WCAG 2.1 AA baseline
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3 text-sm text-white/70">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="font-semibold text-white">Keyboard nav</p>
            <p className="text-xs text-white/60">Tab order verified on auth, checkout, dashboard flows.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="font-semibold text-white">Contrast</p>
            <p className="text-xs text-white/60">Buttons/forms meet 4.5:1; spot checks captured.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="font-semibold text-white">ARIA labels</p>
            <p className="text-xs text-white/60">Labels on form fields, nav, icons; screenreader smoke test.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-5 w-5 text-primary" />
            OWASP baseline + scans
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3 text-sm text-white/70">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="font-semibold text-white">CSRF/XSS protections</p>
            <p className="text-xs text-white/60">CSR tokens enforced on forms; output encoding noted.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="font-semibold text-white">Dependency scan</p>
            <p className="text-xs text-white/60">Weekly automated scan planned; backlog triage process.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="font-semibold text-white">Pentest plan</p>
            <p className="text-xs text-white/60">Quarterly external pentest scheduled; scope logged.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
