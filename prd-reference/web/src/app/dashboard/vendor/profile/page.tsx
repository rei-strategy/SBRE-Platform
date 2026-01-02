"use client";

import { Camera, Contact, FileEdit, FolderKanban, Image, Layers, ListChecks, Map, Server } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const steps = [
  {
    title: "Business details",
    icon: FolderKanban,
    fields: ["Legal business name", "Entity type", "Tax ID / EIN", "Year founded"],
  },
  {
    title: "Contact information",
    icon: Contact,
    fields: ["Primary contact", "Phone", "Email", "Dispatch contact"],
  },
  {
    title: "Service categories",
    icon: Layers,
    fields: ["Construction", "Financing", "Maintenance", "Custom tags"],
  },
  {
    title: "Service coverage",
    icon: Map,
    fields: ["Metro areas", "Radius (mi)", "On-call schedule"],
  },
  {
    title: "Media uploads",
    icon: Camera,
    fields: ["Project photos", "Certifications", "Pitch deck / PDF"],
  },
  {
    title: "Platform connections",
    icon: Server,
    fields: ["HubSpot", "Salesforce", "Custom webhook"],
  },
];

export default function VendorProfileSetupPage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Step 1 · Get Visible Fast</p>
        <h1 className="mt-2 text-3xl font-semibold">Profile setup wizard</h1>
        <p className="text-white/70">
          Complete each card to unlock your profile completion score and placement on the live SBRE map.
        </p>
      </header>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <ListChecks className="h-5 w-5 text-primary" />
            Completion score
          </CardTitle>
          <CardDescription className="text-white/70">Higher scores gain priority on searches.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Current score", value: "74%" },
            { label: "Sections finished", value: "5 / 7" },
            { label: "Estimated time", value: "~8 min" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/50 p-4">
              <p className="text-sm text-white/60">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <Card key={step.title} className="border-white/10 bg-black/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  {step.title}
                </CardTitle>
                <CardDescription className="text-white/70">Tap fields to edit.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {step.fields.map((field) => (
                  <Input key={field} placeholder={field} />
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileEdit className="h-5 w-5 text-primary" />
            Vendor listing create/edit
          </CardTitle>
          <CardDescription className="text-white/70">
            Title, price, media uploads with validation, limits, and draft/publish states.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3 text-sm text-white/70">
          <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
            <p className="text-white">Validation</p>
            <p className="text-xs text-white/60">Required: title, category, price, description.</p>
            <p className="text-xs text-white/60">Price formatting + min/max guardrails.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
            <div className="flex items-center gap-2 text-white">
              <Image className="h-4 w-4 text-primary" />
              Media limits
            </div>
            <p className="text-xs text-white/60">Up to 8 photos, 2 videos; file type + size enforcement.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
            <p className="text-white">Draft / Publish</p>
            <p className="text-xs text-white/60">Save draft, request review, publish once approved; audit trail kept.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
