"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#03060d] px-6 py-16 text-white md:px-8">
      <Card className="w-full max-w-xl border-white/10 bg-white/5 p-8 shadow-[0_30px_90px_rgba(4,9,18,0.7)] backdrop-blur-2xl">
        <CardHeader>
          <CardDescription className="text-white/70">Welcome back</CardDescription>
          <CardTitle className="text-3xl font-semibold">Log in to SBRE Connect™</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <Input type="email" placeholder="Work email" />
          <Input type="password" placeholder="Password" />
          <div className="flex items-center justify-between text-sm text-white/60">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-transparent" /> Remember me
            </label>
            <Link href="/auth/reset" className="text-primary hover:text-primary/80">
              Forgot password?
            </Link>
          </div>
          <Button className="w-full rounded-2xl">
            Log in
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-center text-sm text-white/60">
            New to SBRE Connect?{" "}
            <Link href="/auth/signup" className="text-primary hover:text-primary/80">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

