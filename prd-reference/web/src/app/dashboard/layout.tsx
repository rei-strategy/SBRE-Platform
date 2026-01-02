"use client";

import { DashboardNav } from "@/components/dashboard/nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#020409] text-white">
      <header className="border-b border-white/10 bg-black/50">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between px-6 py-4 md:px-12">
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">SBRE Connect™</p>
          <div className="text-sm text-white/60">Live environment preview</div>
        </div>
      </header>
      <main className="mx-auto max-w-[90rem] px-6 py-12 md:px-12">
        <DashboardNav />
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}

