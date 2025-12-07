create table if not exists public.job_tracking_links (
    id uuid primary key default gen_random_uuid(),
    job_id uuid not null references public.jobs(id) on delete cascade,
    token text not null unique,
    expires_at timestamp with time zone not null,
    created_at timestamp with time zone default now()
);

alter table public.job_tracking_links enable row level security;

create policy "Authenticated users can manage tracking links"
    on public.job_tracking_links
    for all
    to authenticated
    using (true)
    with check (true);
