-- Create research_history table for caching Perplexity results
create table if not exists public.research_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  company_id uuid, -- Optional, if we want to share research within a company
  tool_type text not null, -- 'competitor_insights', 'market_trends', etc.
  input_payload jsonb not null, -- The query parameters (city, service, etc.)
  output_payload jsonb not null, -- The structured result from Perplexity
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.research_history enable row level security;

-- Policies
create policy "Users can view their own research"
  on public.research_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own research"
  on public.research_history for insert
  with check (auth.uid() = user_id);

-- Optional: Company users can view research from their company
create policy "Users can view company research"
  on public.research_history for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.company_id = research_history.company_id
    )
  );
