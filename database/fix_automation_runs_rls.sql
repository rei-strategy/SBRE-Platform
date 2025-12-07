-- Ensure automation_runs table exists
create table if not exists automation_runs (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  automation_id uuid references marketing_automations(id) on delete cascade,
  entity_id uuid,
  status text default 'RUNNING',
  current_step_index integer default 0,
  logs jsonb default '[]'::jsonb,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- Enable RLS
alter table automation_runs enable row level security;

-- Create Policy
drop policy if exists "Enable all access for authenticated users" on automation_runs;
create policy "Enable all access for authenticated users" on automation_runs for all using (auth.role() = 'authenticated');

-- Grant permissions
grant all on automation_runs to authenticated;
grant all on automation_runs to service_role;
