"use client";

import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function TwoFactorPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Two-factor authentication</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Add a second layer of trust.</h1>
        <p className="text-white/70">Preferred method: Authenticator app + SMS backup.</p>
      </header>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Authenticator app
          </CardTitle>
          <CardDescription className="text-white/70">Scan QR and enter code to activate.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-10 text-center text-white/60">
            QR placeholder
          </div>
          <Input placeholder="Enter 6-digit code" />
          <Button className="rounded-xl">Enable</Button>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="text-white">SMS backup</CardTitle>
          <CardDescription className="text-white/70">Send codes to verified phone number.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Input placeholder="Phone number" />
          <Button variant="secondary" className="rounded-xl">
            Verify phone
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

