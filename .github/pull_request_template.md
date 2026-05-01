## Multi-Coach Platform Impact

- [ ] This PR does not consume or modify the CoachClone tenant model.
- [ ] If this PR reads shared platform data, access is scoped by `organizationId` and `coachInstanceId`.
- [ ] This PR does not add a separate Supabase project per coach.
- [ ] This PR does not duplicate CoachClone-owned Supabase schema, RLS, or provisioning logic.
- [ ] Any GitHub/N8N automation updates target `KesOnPurpose/CoachClone` and `staging` by default.

## Checks

- [ ] Build/typecheck command run, or not applicable because this is documentation-only.
- [ ] No Supabase service-role key, GitHub token, or provider secret is committed.
