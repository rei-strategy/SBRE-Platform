-- Vendor coverage and verification support
alter table settings
  add column if not exists coverage_areas text[] default '{}'::text[];

alter table settings
  add column if not exists verification_documents jsonb default '[]'::jsonb;

alter table settings
  add column if not exists verified_business_badge boolean default false;
