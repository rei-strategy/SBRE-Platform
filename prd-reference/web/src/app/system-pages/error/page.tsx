"use client";

import { ErrorPage } from "@/components/ui/error-page";

export default function ErrorPage500() {
  return (
    <ErrorPage
      title="500 · Something went wrong"
      description="We hit an unexpected error. Please try again or contact support."
    />
  );
}

