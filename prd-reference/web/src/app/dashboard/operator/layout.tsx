"use client";

import { OperatorNav } from "@/components/dashboard/operator-nav";

export default function OperatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-8">
      <OperatorNav />
      {children}
    </div>
  );
}

