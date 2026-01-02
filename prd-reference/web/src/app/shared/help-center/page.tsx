"use client";

import { Book } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const articles = [
  "How to Set Up Your Profile",
  "How Verification Works",
  "Understanding Ranking",
  "Lead Routing Explained",
  "Billing Questions",
  "Fixing Rejected Documents",
];

export default function HelpCenterPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Help Center / Knowledge Base</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Browse key articles.</h1>
        <p className="text-white/70">Each role sees contextual guidance.</p>
      </header>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Book className="h-5 w-5 text-primary" />
            Articles
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-white/70 md:grid-cols-2">
          {articles.map((article) => (
            <div key={article} className="rounded-2xl border border-white/10 bg-black/40 p-3">
              {article}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

