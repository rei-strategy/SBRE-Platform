-- Fix for existing tables that are missing new columns

-- 1. Update email_campaigns table
alter table email_campaigns 
add column if not exists preview_text text,
add column if not exists from_name text,
add column if not exists template_id uuid,
add column if not exists audience_id uuid,
add column if not exists audience_filter jsonb,
add column if not exists schedule_time timestamp with time zone,
add column if not exists settings jsonb default '{}'::jsonb;

-- 2. Update audience_segments table
alter table audience_segments
add column if not exists type text default 'DYNAMIC',
add column if not exists criteria jsonb;

-- 3. Make filters optional in audience_segments (if it was not null before)
alter table audience_segments alter column filters drop not null;

-- 4. Ensure RLS is enabled and policies exist (idempotent)
alter table email_campaigns enable row level security;
alter table audience_segments enable row level security;

-- Re-apply policies just in case (dropping first to avoid errors)
drop policy if exists "Enable all access for authenticated users" on email_campaigns;
create policy "Enable all access for authenticated users" on email_campaigns for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on audience_segments;
create policy "Enable all access for authenticated users" on audience_segments for all using (auth.role() = 'authenticated');
