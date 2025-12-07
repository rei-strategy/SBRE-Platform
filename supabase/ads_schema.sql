-- ==========================================
-- MARKETING & ADS INTELLIGENCE (DEMO SCHEMA)
-- ==========================================

-- 1. Demo Campaigns (Meta & Google)
create table public.ad_campaigns_demo (
  id uuid default gen_random_uuid() primary key,
  platform text not null check (platform in ('GOOGLE', 'META')),
  name text not null,
  status text not null check (status in ('ACTIVE', 'PAUSED', 'ENDED')),
  budget numeric not null default 0,
  spend numeric not null default 0,
  impressions int not null default 0,
  clicks int not null default 0,
  conversions int not null default 0,
  roi numeric not null default 0,
  start_date timestamp with time zone default now(),
  end_date timestamp with time zone
);

-- 2. Demo Ad Sets (for Meta mostly, but can map to Ad Groups for Google)
create table public.ad_sets_demo (
  id uuid default gen_random_uuid() primary key,
  campaign_id uuid references public.ad_campaigns_demo(id) on delete cascade,
  name text not null,
  status text not null,
  targeting text, -- JSON string or description
  bid_strategy text
);

-- 3. Demo Ads
create table public.ad_ads_demo (
  id uuid default gen_random_uuid() primary key,
  ad_set_id uuid references public.ad_sets_demo(id) on delete cascade,
  name text not null,
  status text not null,
  creative_url text, -- Image URL
  headline text,
  primary_text text,
  clicks int default 0,
  ctr numeric default 0,
  cpc numeric default 0
);

-- 4. AI Creative Studio - Saved Creatives
create table public.ad_creatives (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  type text not null check (type in ('IMAGE', 'COPY')),
  content text, -- Image URL or Text Copy
  prompt_used text,
  tags text[],
  created_at timestamp with time zone default now()
);

-- 5. AI Creative Studio - Compositions
create table public.ad_compositions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  name text not null,
  platform text,
  image_url text,
  headline text,
  description text,
  primary_text text, -- Meta
  status text default 'DRAFT',
  created_at timestamp with time zone default now()
);

-- 6. Attribution Demo
create table public.attribution_demo (
  id uuid default gen_random_uuid() primary key,
  source text not null, -- Google, Meta, Direct, Referral
  leads_count int default 0,
  jobs_booked int default 0,
  revenue numeric default 0,
  cost_per_lead numeric default 0,
  cost_per_acquisition numeric default 0,
  date date default current_date
);

-- Enable RLS
alter table public.ad_campaigns_demo enable row level security;
alter table public.ad_sets_demo enable row level security;
alter table public.ad_ads_demo enable row level security;
alter table public.ad_creatives enable row level security;
alter table public.ad_compositions enable row level security;
alter table public.attribution_demo enable row level security;

-- Policies (Open for Demo)
create policy "Allow all access to demo data" on public.ad_campaigns_demo for all using (true);
create policy "Allow all access to demo sets" on public.ad_sets_demo for all using (true);
create policy "Allow all access to demo ads" on public.ad_ads_demo for all using (true);
create policy "Allow all access to attribution" on public.attribution_demo for all using (true);

-- User specific policies
create policy "Users can manage own creatives" on public.ad_creatives for all using (auth.uid() = user_id);
create policy "Users can manage own compositions" on public.ad_compositions for all using (auth.uid() = user_id);
