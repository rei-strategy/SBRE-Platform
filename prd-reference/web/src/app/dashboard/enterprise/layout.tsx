"use client";

import { EnterpriseNav } from "@/components/dashboard/enterprise-nav";

export default function EnterpriseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-8">
      <EnterpriseNav />
      {children}
    </div>
  );
}

