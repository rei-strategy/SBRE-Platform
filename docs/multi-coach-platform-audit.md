# Multi-Coach Platform Audit

`SBRE-Platform` is related but not the primary implementation repo for the shared coach platform. The canonical multi-coach implementation lives in `KesOnPurpose/CoachClone`, with `organization_id` as the Supabase isolation boundary.

Current alignment rule:

- Do not create a Supabase project per coach.
- Do not duplicate CoachClone provisioning tables or RLS policy ownership here.
- If this repo consumes shared coach data, require `organizationId`, `coachInstanceId`, user identity, and role/entitlement checks before backend access.
- Keep deployment and automation references configurable through environment variables instead of hardcoding a repo or branch.
- Treat CoachClone as the source of truth for feature flags, organizational values, coach AI profiles, and provisioning runs.

If SBRE becomes an active consumer of CoachClone tenant data, add integration tests proving cross-organization access is denied before enabling production usage.
