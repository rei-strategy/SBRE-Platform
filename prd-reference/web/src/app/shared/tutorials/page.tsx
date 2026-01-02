"use client";

import { PlayCircle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const videos = [
  { title: "SBRE Overview", duration: "04:32", description: "Tour the vendor + operator experiences." },
  { title: "Verification workflow", duration: "06:15", description: "Everything you need for badges." },
  { title: "Lead routing & SLAs", duration: "05:08", description: "Automate responses and keep timers green." },
];

export default function TutorialsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Video Tutorials</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Learn SBRE faster.</h1>
        <p className="text-white/70">Structured library for all user types.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {videos.map((video) => (
          <Card key={video.title} className="border-white/10 bg-black/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <PlayCircle className="h-5 w-5 text-primary" />
                {video.title}
              </CardTitle>
              <CardDescription className="text-white/70">{video.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-white/60">Duration {video.duration}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

