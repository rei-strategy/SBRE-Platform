"use client";

import { ErrorPage } from "@/components/ui/error-page";

export default function VerificationFailedPage() {
  return (
    <ErrorPage
      title="Verification failed"
      description="We couldn’t verify your documents. Please review the requirements and try again."
      actions={[
        { label: "Review requirements", href: "/dashboard/vendor/verification" },
        { label: "Contact support", href: "/shared/contact" },
      ]}
    />
  );
}

