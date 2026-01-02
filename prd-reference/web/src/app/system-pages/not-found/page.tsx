"use client";

import { ErrorPage } from "@/components/ui/error-page";

export default function NotFoundPage() {
  return (
    <ErrorPage
      title="404 · Not Found"
      description="The page you’re looking for doesn’t exist or has been moved."
    />
  );
}

