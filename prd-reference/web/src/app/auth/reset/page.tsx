"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ResetPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#02050b] px-6 py-16 text-white md:px-8">
      <Card className="w-full max-w-lg border-white/10 bg-black/60 p-8 shadow-[0_25px_80px_rgba(5,8,20,0.7)] backdrop-blur-2xl">
        <CardHeader>
          <CardDescription className="text-white/70">Reset password</CardDescription>
          <CardTitle className="text-3xl font-semibold">Send recovery link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-white/70">
            Enter the email connected to your SBRE Connect account. We’ll send instructions plus a one-time verification
            code for added security.
          </p>
          <Input type="email" placeholder="Work email" />
          <Button className="w-full rounded-2xl">Email reset link</Button>
          <p className="text-center text-sm text-white/60">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-primary">
              Go back to login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

