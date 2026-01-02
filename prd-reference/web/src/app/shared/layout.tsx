"use client";

import { SharedNav } from "@/components/dashboard/shared-nav";

export default function SharedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#020409] text-white">
      <div className="mx-auto max-w-[90rem] px-6 py-12 md:px-12">
        <SharedNav />
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

