"use client";

import { ErrorPage } from "@/components/ui/error-page";

export default function AccountSuspendedPage() {
  return (
    <ErrorPage
      title="Account suspended"
      description="This account has been temporarily suspended. Please contact SBRE support to resolve."
      actions={[
        { label: "Contact support", href: "/shared/contact" },
        { label: "Return home", href: "/" },
      ]}
    />
  );
}

