"use client";

import { Cloud, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const integrations = [
  { title: "Platform partners", items: ["Salesforce", "HubSpot", "Monday"] },
  { title: "Data imports", items: ["Snowflake", "BigQuery", "S3"] },
  { title: "Custom SSO", items: ["Okta", "Azure AD", "Custom SAML"] },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">API & Integrations</p>
        <h1 className="mt-2 text-3xl font-semibold">Connect SBRE to your stack.</h1>
        <p className="text-white/70">
          Manage platform partners, data imports, and enterprise SSO. Webhooks + event streams keep your systems synchronized.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {integrations.map((row) => (
          <Card key={row.title} className="border-white/10 bg-black/60">
            <CardHeader>
              <CardTitle>{row.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-white/70">
              {row.items.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/40 px-3 py-2">
                  {item}
                </div>
              ))}
              <Button variant="secondary" className="mt-3 rounded-xl">
                Configure
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            API credentials
          </CardTitle>
          <CardDescription className="text-white/70">Issue keys + manage scopes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-white/70">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3">Client ID: sbre_enterprise_9847</div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3">Webhook endpoint: https://example.com/hook</div>
          <Button className="rounded-xl">Generate new key</Button>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Security & compliance
          </CardTitle>
          <CardDescription className="text-white/70">Audit logs, scopes, and IP allowlists.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-white/70">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3">IP allowlist: 12 entries</div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3">Audit log: 48 events past 24h</div>
          <Button variant="secondary" className="rounded-xl">
            View logs
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
