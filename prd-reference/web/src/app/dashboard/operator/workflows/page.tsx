"use client";

import { AlertTriangle, Workflow } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const workflows = [
  { title: "Notification rules", description: "SMS + Slack alerts for new projects and escalations." },
  { title: "Review request rules", description: "Trigger review invites after vendor completes service." },
  { title: "Post-service follow-up", description: "Automated email sequences checking satisfaction." },
  { title: "Incident / dispute form", description: "Route issues directly to SBRE support + vendor." },
];

export default function OperatorWorkflowsPage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Workflows & Automations</p>
        <h1 className="mt-2 text-3xl font-semibold">Stop copy/paste operations.</h1>
        <p className="text-white/70">
          Configure notification rules, review cadences, follow-up sequences, and incident forms from one workflow hub.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {workflows.map((flow) => (
          <Card key={flow.title} className="border-white/10 bg-black/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5 text-primary" />
                {flow.title}
              </CardTitle>
              <CardDescription className="text-white/70">{flow.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Add new condition or template" />
              <Button variant="secondary" className="rounded-xl">
                Save workflow
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Incident / dispute form preview
          </CardTitle>
          <CardDescription className="text-white/70">
            What a vendor sees when an operator files an incident.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Describe the incident" />
          <Input placeholder="Attach evidence links" />
          <Button className="rounded-xl">Submit incident</Button>
        </CardContent>
      </Card>
    </div>
  );
}
