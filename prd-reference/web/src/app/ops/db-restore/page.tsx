"use client";

import { Database, FileCheck2, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DbRestoreRunbookPage() {
  return (
    <div className="min-h-screen bg-[#03060e] px-6 py-16 text-white md:px-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <header>
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Ops Runbook</p>
          <h1 className="mt-3 text-4xl font-semibold">DB Backup / Restore</h1>
          <p className="mt-3 text-white/70">
            Restore prod database within targets. RTO ≤ 30 min, RPO ≤ 5 min.
          </p>
        </header>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Backup schedule
            </CardTitle>
            <CardDescription className="text-white/70">
              Daily full backups (00:30 UTC) + 5-min binlog shipping to S3.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/70">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3">Storage: s3://sbre-prod-db-backups/</div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
              Integrity check nightly via pg_verifybackup; alerts if checksum fails.
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Undo2 className="h-5 w-5 text-primary" />
              Restore procedure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-white/70">
            <ol className="space-y-3 text-sm">
              <li>1. Snapshot current prod (read-only) for forensics.</li>
              <li>2. Provision restore target via `pg_restore` from last full backup.</li>
              <li>3. Replay WAL/binlogs to desired point-in-time (within RPO 5 min).</li>
              <li>4. Run smoke tests (health checks + sample queries).</li>
              <li>5. Flip traffic via RDS cluster failover / connection string update.</li>
              <li>6. Monitor latency & error metrics for 15 min before closing incident.</li>
            </ol>
            <Button variant="secondary" className="rounded-xl">
              View full runbook
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-primary" />
              RTO / RPO documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 text-sm text-white/70">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-white/60">RTO target</p>
              <p className="text-2xl font-semibold">30 min</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-white/60">RPO target</p>
              <p className="text-2xl font-semibold">5 min</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-white/60">Last restore test</p>
              <p>2025-04-15 • Passed (22 min total)</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-white/60">Next scheduled test</p>
              <p>2025-05-15</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

