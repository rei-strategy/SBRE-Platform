"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export function ErrorPage({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: { label: string; href: string }[];
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#020409] px-6 text-center text-white">
      <div className="max-w-xl space-y-6 rounded-[36px] border border-white/10 bg-white/5 p-10 shadow-[0_30px_90px_rgba(2,6,23,0.7)]">
        <h1 className="text-4xl font-semibold">{title}</h1>
        <p className="text-white/70">{description}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {(actions ?? [{ label: "Return home", href: "/" }]).map((action) => (
            <Button key={action.label} className="rounded-2xl" asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

