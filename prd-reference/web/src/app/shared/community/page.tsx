"use client";

import { Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Community</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Join the SBRE Forum + FB Group.</h1>
        <p className="text-white/70">Share wins, get answers, and collaborate with other operators and vendors.</p>
      </header>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5 text-primary" />
            SBRE Community Forum
          </CardTitle>
          <CardDescription className="text-white/70">Private Circle/Slack-style space.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-white/70">
          <p>Discuss best practices, ask for referrals, and get early access invites.</p>
          <Button className="rounded-xl">Request invite</Button>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="text-white">Facebook Group</CardTitle>
          <CardDescription className="text-white/70">Link share from deliverables.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-white/70">Join the SBRE Connect operators & vendors FB group.</p>
          <Button variant="secondary" className="rounded-xl">
            Join group
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

