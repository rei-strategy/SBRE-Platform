-- ============================================================
-- CONSOLIDATED SCHEMA SCRIPT (MASTER)
-- ============================================================
-- This script contains the COMPLETE definition for the application.
-- It is designed to be idempotent (safe to run multiple times).
-- Contains:
-- 1. Core Platform & Operations (Jobs, Clients, Invoices, etc.)
-- 2. Marketing & Automations
-- 3. Inventory System
-- 4. Ads Intelligence Demo Data
-- 5. Research & Insights History
-- ============================================================

-- 1. ENABLE EXTENSIONS
create extension if not exists "uuid-ossp";

-- ============================================================
-- 2. CREATE TABLES (IF NOT EXISTS)
-- ============================================================

-- PROFILES
create table if not exists profiles (
  id uuid primary key,
  company_id uuid,
  email text unique not null,
  full_name text,
  role text default 'ADMIN',
  avatar_url text,
  color text default 'blue',
  onboarding_complete boolean default false,
  enable_timesheets boolean default true,
  payroll_type text default 'HOURLY',
  pay_rate numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SETTINGS
create table if not exists settings (
  company_id uuid primary key,
  company_name text not null,
  company_address text,
  company_code text unique,
  tax_rate numeric default 0.08,
  currency text default 'USD',
  business_hours_start text default '08:00',
  business_hours_end text default '18:00',
  low_stock_threshold integer default 5,
  enable_auto_invoice boolean default false,
  sms_template_on_my_way text,
  service_categories text[],
  payment_methods text[],
  onboarding_step integer default 1,
  industry text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TEAM INVITATIONS
create table if not exists team_invitations (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  email text not null,
  name text,
  role text default 'TECHNICIAN',
  code text not null,
  status text default 'PENDING',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CLIENTS
create table if not exists clients (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  first_name text,
  last_name text,
  company_name text,
  email text,
  phone text,
  billing_address text,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROPERTIES
create table if not exists properties (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  client_id uuid references clients(id) on delete cascade,
  address text not null,
  access_instructions text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- JOBS
create table if not exists jobs (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  client_id uuid references clients(id) on delete cascade,
  property_id uuid references properties(id),
  title text not null,
  description text,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  status text default 'DRAFT',
  priority text default 'MEDIUM',
  vehicle_details text,
  assigned_tech_ids uuid[],
  pipeline_stage text default 'LEAD',
  sentiment text default 'NEUTRAL',
  last_stage_change timestamp with time zone default now(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LINE ITEMS
create table if not exists line_items (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  job_id uuid references jobs(id) on delete cascade,
  quote_id uuid,
  invoice_id uuid,
  description text not null,
  quantity numeric default 1,
  unit_price numeric default 0,
  total numeric generated always as (quantity * unit_price) stored,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CHECKLISTS
create table if not exists checklists (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  job_id uuid references jobs(id) on delete cascade,
  label text not null,
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- JOB PHOTOS
create table if not exists job_photos (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  job_id uuid references jobs(id) on delete cascade,
  url text not null,
  caption text,
  uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- QUOTES
create table if not exists quotes (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  client_id uuid references clients(id) on delete cascade,
  property_id uuid references properties(id),
  subtotal numeric default 0,
  tax numeric default 0,
  total numeric default 0,
  status text default 'DRAFT',
  issued_date timestamp with time zone,
  expiry_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INVOICES
create table if not exists invoices (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  client_id uuid references clients(id) on delete cascade,
  job_id uuid references jobs(id) on delete set null,
  subtotal numeric default 0,
  tax numeric default 0,
  total numeric default 0,
  balance_due numeric default 0,
  status text default 'DRAFT',
  due_date timestamp with time zone,
  issued_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PAYMENTS
create table if not exists payments (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  invoice_id uuid references invoices(id) on delete cascade,
  amount numeric not null,
  method text,
  transaction_id text,
  date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TIME ENTRIES
create table if not exists time_entries (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  user_id uuid references profiles(id) on delete cascade, 
  job_id uuid references jobs(id) on delete cascade,
  type text not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  duration_minutes integer,
  status text default 'PENDING',
  gps_location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- VENDORS
create table if not exists vendors (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  name text not null,
  email text,
  phone text,
  contact_person text,
  payment_terms text,
  lead_time_days integer default 0,
  rating integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PURCHASE ORDERS
create table if not exists purchase_orders (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  vendor_id uuid references vendors(id) on delete set null,
  status text default 'DRAFT', -- 'DRAFT', 'ORDERED', 'PARTIAL', 'RECEIVED', 'CANCELLED'
  order_date timestamp with time zone default timezone('utc'::text, now()) not null,
  expected_date timestamp with time zone,
  items jsonb default '[]'::jsonb, -- Array of { productId, quantity, cost }
  total numeric default 0,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INVENTORY PRODUCTS
create table if not exists inventory_products (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  sku text,
  name text not null,
  description text,
  image_url text,
  barcode text,
  category text,
  brand text,
  cost numeric default 0,
  price numeric default 0,
  min_stock integer default 0,
  track_serial boolean default false,
  supplier_id uuid references vendors(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- WAREHOUSES
create table if not exists warehouses (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  name text not null,
  type text default 'MAIN',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INVENTORY STOCK
create table if not exists inventory_stock (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  product_id uuid references inventory_products(id) on delete cascade,
  warehouse_id uuid references warehouses(id) on delete cascade,
  quantity integer default 0,
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(product_id, warehouse_id)
);

-- INVENTORY HISTORY
create table if not exists inventory_history (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  product_id uuid references inventory_products(id) on delete cascade,
  warehouse_id uuid references warehouses(id) on delete cascade,
  change_quantity integer not null, -- Positive or Negative
  new_quantity integer not null,
  reason text, -- 'JOB_USAGE', 'PURCHASE_ORDER', 'ADJUSTMENT', 'TRANSFER'
  reference_id uuid, -- Link to Job, PO, etc.
  user_id uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CHATS
create table if not exists chats (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  type text default 'DIRECT',
  name text,
  participant_ids uuid[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MESSAGES
create table if not exists messages (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  chat_id uuid references chats(id) on delete cascade,
  sender_id uuid references profiles(id),
  content text not null,
  read_by uuid[],
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- AUDIENCE SEGMENTS
create table if not exists audience_segments (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  name text not null,
  description text,
  type text default 'DYNAMIC',
  filters jsonb,
  criteria jsonb,
  estimated_count integer default 0,
  last_calculated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MARKETING TEMPLATES
create table if not exists marketing_templates (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid,
  name text not null,
  subject text,
  content text not null,
  category text,
  thumbnail_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MARKETING CAMPAIGNS
create table if not exists email_campaigns (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  name text not null,
  subject text,
  preview_text text,
  from_name text,
  content text,
  template_id uuid,
  audience_id uuid,
  audience_filter jsonb,
  schedule_time timestamp with time zone,
  status text default 'DRAFT',
  settings jsonb default '{}'::jsonb,
  sent_count integer default 0,
  open_count integer default 0,
  click_count integer default 0,
  delivered_count integer default 0, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MARKETING AUTOMATIONS
create table if not exists marketing_automations (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  name text not null,
  description text,
  trigger_type text,
  trigger_config jsonb default '{}'::jsonb,
  steps jsonb default '[]'::jsonb,
  is_active boolean default false,
  stats jsonb default '{"runs": 0, "completed": 0}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- AUTOMATION RUNS
create table if not exists automation_runs (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  automation_id uuid references marketing_automations(id) on delete cascade,
  entity_id uuid,
  status text default 'RUNNING',
  current_step_index integer default 0,
  logs jsonb default '[]'::jsonb,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  next_run_at timestamp with time zone 
);

-- EMAIL LOGS
create table if not exists email_logs (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  campaign_id uuid references email_campaigns(id) on delete cascade, 
  automation_id uuid references marketing_automations(id),
  recipient_email text not null,
  recipient_id uuid,
  status text default 'SENT',
  opened_at timestamp with time zone,
  clicked_at timestamp with time zone,
  delivered_at timestamp with time zone,
  sent_at timestamp with time zone default timezone('utc'::text, now()) not null,
  error_message text
);

-- RESEARCH HISTORY (Market Intel)
create table if not exists research_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  company_id uuid, 
  tool_type text not null, 
  input_payload jsonb not null, 
  output_payload jsonb not null, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================================
-- ADS DEMO TABLES (For Intelligence Module)
-- ============================================================

-- 1. Demo Campaigns
create table if not exists ad_campaigns_demo (
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

-- 2. Demo Ad Sets
create table if not exists ad_sets_demo (
  id uuid default gen_random_uuid() primary key,
  campaign_id uuid references ad_campaigns_demo(id) on delete cascade,
  name text not null,
  status text not null,
  targeting text, 
  bid_strategy text
);

-- 3. Demo Ads
create table if not exists ad_ads_demo (
  id uuid default gen_random_uuid() primary key,
  ad_set_id uuid references ad_sets_demo(id) on delete cascade,
  name text not null,
  status text not null,
  creative_url text, 
  headline text,
  primary_text text,
  clicks int default 0,
  ctr numeric default 0,
  cpc numeric default 0
);

-- 4. AI Creative Studio - Saved Creatives
create table if not exists ad_creatives (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  type text not null check (type in ('IMAGE', 'COPY')),
  content text, 
  prompt_used text,
  tags text[],
  created_at timestamp with time zone default now()
);

-- 5. AI Creative Studio - Compositions
create table if not exists ad_compositions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  name text not null,
  platform text,
  image_url text,
  headline text,
  description text,
  primary_text text, 
  status text default 'DRAFT',
  created_at timestamp with time zone default now()
);

-- 6. Attribution Demo
create table if not exists attribution_demo (
  id uuid default gen_random_uuid() primary key,
  source text not null, -- Google, Meta, Direct, Referral
  leads_count int default 0,
  jobs_booked int default 0,
  revenue numeric default 0,
  cost_per_lead numeric default 0,
  cost_per_acquisition numeric default 0,
  date date default current_date
);

-- ============================================================
-- 3. APPLY UPDATES (Idempotent ALTERs)
-- ============================================================
-- These sections ensure backwards compatibility if running against older DBs

-- Jobs Updates
alter table jobs add column if not exists sentiment text default 'NEUTRAL';
alter table jobs add column if not exists last_stage_change timestamp with time zone default now();

-- Campaign Updates
alter table email_campaigns add column if not exists preview_text text;
alter table email_campaigns add column if not exists from_name text;
alter table email_campaigns add column if not exists template_id uuid;
alter table email_campaigns add column if not exists audience_id uuid;
alter table email_campaigns add column if not exists audience_filter jsonb;
alter table email_campaigns add column if not exists schedule_time timestamp with time zone;
alter table email_campaigns add column if not exists settings jsonb default '{}'::jsonb;
alter table email_campaigns add column if not exists delivered_count integer default 0;

-- Audience Updates
alter table audience_segments add column if not exists type text default 'DYNAMIC';
alter table audience_segments add column if not exists criteria jsonb;
alter table audience_segments alter column filters drop not null;

-- Settings Updates
alter table settings add column if not exists industry text;

-- Team Updates
alter table team_invitations add column if not exists name text;
alter table profiles add column if not exists color text default 'blue';

-- Automation Updates
alter table automation_runs add column if not exists next_run_at timestamp with time zone;
alter table automation_runs add column if not exists started_at timestamp with time zone default timezone('utc'::text, now()) not null;
alter table automation_runs add column if not exists completed_at timestamp with time zone;

-- Email Logs Updates
alter table email_logs add column if not exists delivered_at timestamp with time zone;

-- Inventory Updates (if missing FKs)
do $$
begin
  if not exists (select 1 from information_schema.table_constraints where constraint_name = 'inventory_products_supplier_id_fkey') then
    alter table inventory_products add constraint inventory_products_supplier_id_fkey foreign key (supplier_id) references vendors(id) on delete set null;
  end if;
end $$;

-- ============================================================
-- 4. ENABLE RLS
-- ============================================================
do $$
declare
  t text;
  tables text[] := array[
    'profiles', 'settings', 'clients', 'properties', 'jobs', 'line_items', 
    'checklists', 'job_photos', 'quotes', 'invoices', 'payments', 'time_entries', 
    'inventory_products', 'inventory_stock', 'warehouses', 'chats', 'messages', 
    'email_campaigns', 'marketing_automations', 'team_invitations', 
    'audience_segments', 'email_logs', 'automation_runs', 'marketing_templates',
    'vendors', 'purchase_orders', 'inventory_history', 'research_history',
    'ad_campaigns_demo', 'ad_sets_demo', 'ad_ads_demo', 'ad_creatives', 
    'ad_compositions', 'attribution_demo'
  ];
begin
  foreach t in array tables loop
    execute format('alter table %I enable row level security', t);
  end loop;
end $$;

-- ============================================================
-- 5. RLS POLICIES
-- ============================================================
-- Simple policy: Authenticated users can do everything.
do $$
declare
  t text;
  tables text[] := array[
    'profiles', 'settings', 'clients', 'properties', 'jobs', 'line_items', 
    'checklists', 'job_photos', 'quotes', 'invoices', 'payments', 'time_entries', 
    'inventory_products', 'inventory_stock', 'warehouses', 'chats', 'messages', 
    'email_campaigns', 'marketing_automations', 'team_invitations', 
    'audience_segments', 'email_logs', 'automation_runs', 'marketing_templates',
    'vendors', 'purchase_orders', 'inventory_history', 'research_history',
    'ad_campaigns_demo', 'ad_sets_demo', 'ad_ads_demo', 'ad_creatives', 
    'ad_compositions', 'attribution_demo'
  ];
begin
  foreach t in array tables loop
    execute format('drop policy if exists "Enable all access for authenticated users" on %I', t);
    execute format('create policy "Enable all access for authenticated users" on %I for all using (auth.role() = ''authenticated'')', t);
  end loop;
end $$;

-- ============================================================
-- 6. HELPER FUNCTIONS
-- ============================================================

-- Increment Open Count
create or replace function increment_open_count(campaign_id uuid)
returns void as $$
begin
  update email_campaigns set open_count = open_count + 1 where id = campaign_id;
end;
$$ language plpgsql security definer;

-- Increment Click Count
create or replace function increment_click_count(campaign_id uuid)
returns void as $$
begin
  update email_campaigns set click_count = click_count + 1 where id = campaign_id;
end;
$$ language plpgsql security definer;

-- Increment Delivered Count
create or replace function increment_delivered_count(campaign_id uuid)
returns void as $$
begin
  update email_campaigns set delivered_count = delivered_count + 1 where id = campaign_id;
end;
$$ language plpgsql security definer;

-- Get Company ID by Code
create or replace function get_company_id_by_code(code_input text)
returns uuid as $$
  select company_id from settings where company_code = code_input limit 1;
$$ language sql security definer;
