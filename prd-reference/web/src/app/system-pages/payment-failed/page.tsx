"use client";

import { ErrorPage } from "@/components/ui/error-page";

export default function PaymentFailedPage() {
  return (
    <ErrorPage
      title="Payment failed"
      description="We couldn’t process your payment. Please update your billing details."
      actions={[
        { label: "Go to billing", href: "/shared/billing" },
        { label: "Contact support", href: "/shared/contact" },
      ]}
    />
  );
}

