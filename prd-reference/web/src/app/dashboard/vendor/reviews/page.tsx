"use client";

import { MessageSquareQuote, Star, Sparkles } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const reviews = [
  {
    quote: "SBRE vendor delivered on multi-site rollout in Dallas and Atlanta—great communication + speed.",
    author: "Peakstone Partners",
    rating: "4.9",
  },
  {
    quote: "Kept us updated throughout unexpected supply delays and closed under budget.",
    author: "Northwind Retail",
    rating: "4.8",
  },
];

export default function ReviewsPage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Step 6 · Reviews & Reputation</p>
        <h1 className="mt-2 text-3xl font-semibold">Build a public proof wall.</h1>
        <p className="text-white/70">
          Automate review requests, respond publicly, and use templates to keep tone consistent.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareQuote className="h-5 w-5 text-primary" />
              Review requests automation
            </CardTitle>
            <CardDescription className="text-white/70">
              Trigger review invites after task completion or invoice paid.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/70">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3">Template: Post-service follow-up</div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3">Template: High-touch projects</div>
            <Button variant="secondary" className="rounded-xl">
              Create template
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Rating breakdown
            </CardTitle>
            <CardDescription className="text-white/70">
              Weighted by recency and project size.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Overall rating", value: "4.87" },
              { label: "Last 90 days", value: "4.92" },
              { label: "Responses sent", value: "96%" },
              { label: "Templates used", value: "73%" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="text-sm text-white/60">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Published reviews
          </CardTitle>
          <CardDescription className="text-white/70">Pin showcase quotes to your profile.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <div key={review.author} className="rounded-2xl border border-white/10 bg-black/50 p-4 text-sm text-white/70">
              <p>“{review.quote}”</p>
              <p className="mt-3 font-semibold text-white">{review.author}</p>
              <p className="text-white/60">{review.rating} / 5</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

