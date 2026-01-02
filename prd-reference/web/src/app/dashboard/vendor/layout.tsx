"use client";

import { VendorNav } from "@/components/dashboard/vendor-nav";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-8">
      <VendorNav />
      {children}
    </div>
  );
}

