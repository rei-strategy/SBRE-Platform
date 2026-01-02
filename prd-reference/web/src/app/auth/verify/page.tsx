"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function VerificationPage() {
  return (
    <main className="min-h-screen bg-[#03060d] px-6 py-20 text-white md:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-3 text-primary">
          <ShieldCheck className="h-6 w-6" />
          <p className="text-sm uppercase tracking-[0.4em] text-white/70">Verification required</p>
        </div>
        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">Confirm your email + phone.</h1>
        <p className="mt-4 text-lg text-white/70">
          SBRE Connect™ routes leads, escalations, and compliance alerts through these channels. Accuracy ensures you stay
          within SLA windows and maintain badge status.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-[90rem] gap-8 md:grid-cols-2">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle>Email verification</CardTitle>
            <CardDescription className="text-white/70">
              Check your inbox for a 6-digit code. Codes expire in 10 minutes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Enter code" maxLength={6} />
            <Button className="w-full rounded-2xl">Verify email</Button>
            <p className="text-sm text-white/60">
              Didn’t get it? <button className="text-primary">Resend code</button>
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle>Phone verification</CardTitle>
            <CardDescription className="text-white/70">
              We text alerts for new leads and compliance changes. Enter the SMS code to activate routing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Enter SMS code" maxLength={6} />
            <Button className="w-full rounded-2xl">Verify phone</Button>
            <p className="text-sm text-white/60">
              Need to update your number? <Link href="/settings" className="text-primary">Update contact info</Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mx-auto mt-10 max-w-4xl rounded-[28px] border border-white/10 bg-black/50 p-6 text-sm text-white/70">
        <p>
          Once both channels are verified, we’ll unlock the rest of your onboarding checklist: licenses, insurance, and routing
          rules. Keep the same email/phone across integrations for consistent analytics.
        </p>
      </div>
    </main>
  );
}

