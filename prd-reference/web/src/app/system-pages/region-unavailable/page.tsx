"use client";

import { ErrorPage } from "@/components/ui/error-page";

export default function RegionUnavailablePage() {
  return (
    <ErrorPage
      title="Region not available yet"
      description="We’re not live in this region yet. Join the waitlist and we’ll alert you once SBRE launches."
      actions={[
        { label: "Join waitlist", href: "/shared/contact" },
        { label: "Return home", href: "/" },
      ]}
    />
  );
}

