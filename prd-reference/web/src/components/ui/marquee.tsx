"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const SEGMENT = "〰〰〰〰〰〰〰〰 〰 〰";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  speedClassName?: string;
  textClassName?: string;
}

export function Marquee({ className, speedClassName, textClassName }: MarqueeProps) {
  return (
    <div className={cn("relative w-full overflow-hidden py-1", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[rgba(2,6,23,0.95)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[rgba(2,6,23,0.95)] to-transparent" />
      <div
        className={cn(
          "flex min-w-[200%] whitespace-nowrap text-base tracking-[0.4em] text-white/60",
          speedClassName ?? "animate-marquee",
          textClassName,
        )}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={index} className="px-6">
            {SEGMENT}
          </span>
        ))}
      </div>
    </div>
  );
}
