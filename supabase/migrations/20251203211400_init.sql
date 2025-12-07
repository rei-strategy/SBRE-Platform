-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  company_id uuid, -- Will be set after company creation/joining
  email text unique not null,
  full_name text,
  role text default 'ADMIN', -- 'ADMIN', 'TECHNICIAN', 'OFFICE'
  avatar_url text,
  onboarding_complete boolean default false,
  enable_timesheets boolean default true,
  payroll_type text default 'HOURLY',
  pay_rate numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SETTINGS (Company Settings)
create table if not exists settings (
  company_id uuid primary key,
  company_name text not null,
  company_address text,
  company_code text unique, -- For joining
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
  industry text, -- NEW: Track industry
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TEAM INVITATIONS (NEW)
create table if not exists team_invitations (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  email text not null,
  name text, -- NEW: Name of the invitee
  role text default 'TECHNICIAN',
  code text not null, -- The company code used for the invite
  status text default 'PENDING', -- 'PENDING', 'ACCEPTED'
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
  status text default 'DRAFT', -- 'DRAFT', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
  priority text default 'MEDIUM',
  vehicle_details text,
  assigned_tech_ids uuid[],
  pipeline_stage text default 'LEAD',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LINE ITEMS (Shared for Jobs, Quotes, Invoices)
create table if not exists line_items (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  job_id uuid references jobs(id) on delete cascade,
  quote_id uuid, -- references quotes(id)
  invoice_id uuid, -- references invoices(id)
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
  client_id uuid references clients(id),
  property_id uuid references properties(id),
  subtotal numeric default 0,
  tax numeric default 0,
  total numeric default 0,
  status text default 'DRAFT', -- 'DRAFT', 'SENT', 'ACCEPTED', 'REJECTED'
  issued_date timestamp with time zone,
  expiry_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INVOICES
create table if not exists invoices (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  client_id uuid references clients(id),
  job_id uuid references jobs(id),
  subtotal numeric default 0,
  tax numeric default 0,
  total numeric default 0,
  balance_due numeric default 0,
  status text default 'DRAFT', -- 'DRAFT', 'SENT', 'PAID', 'OVERDUE'
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
  method text, -- 'CREDIT_CARD', 'CASH', 'CHECK', 'TRANSFER'
  transaction_id text,
  date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TIME ENTRIES
create table if not exists time_entries (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  user_id uuid references profiles(id),
  job_id uuid references jobs(id),
  type text not null, -- 'CLOCK_IN', 'CLOCK_OUT', 'BREAK_START', 'BREAK_END'
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  duration_minutes integer,
  status text default 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
  gps_location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INVENTORY PRODUCTS
create table if not exists inventory_products (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  sku text,
  name text not null,
  category text,
  brand text,
  cost numeric default 0,
  price numeric default 0,
  min_stock integer default 0,
  track_serial boolean default false,
  supplier_id uuid, -- references vendors
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INVENTORY STOCK
create table if not exists inventory_stock (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  product_id uuid references inventory_products(id) on delete cascade,
  warehouse_id uuid, -- references warehouses
  quantity integer default 0,
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(product_id, warehouse_id)
);

-- WAREHOUSES
create table if not exists warehouses (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  name text not null,
  type text default 'MAIN', -- 'MAIN', 'VEHICLE'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CHATS
create table if not exists chats (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  type text default 'DIRECT', -- 'DIRECT', 'GROUP'
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

-- MARKETING CAMPAIGNS
create table if not exists email_campaigns (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  name text not null,
  subject text,
  preview_text text, -- NEW
  from_name text, -- NEW
  content text, -- HTML content
  template_id uuid, -- NEW
  audience_id uuid, -- NEW: Link to saved segment
  audience_filter jsonb, -- NEW: Store ad-hoc filter if no segment
  schedule_time timestamp with time zone, -- NEW
  status text default 'DRAFT', -- 'DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'ARCHIVED'
  settings jsonb default '{}'::jsonb, -- NEW: A/B testing config, etc.
  sent_count integer default 0,
  open_count integer default 0,
  click_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MARKETING AUTOMATIONS
create table if not exists marketing_automations (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  name text not null,
  description text, -- NEW
  trigger_type text, -- 'NEW_CLIENT', 'QUOTE_ACCEPTED', etc.
  trigger_config jsonb default '{}'::jsonb, -- NEW: Specific conditions
  steps jsonb default '[]'::jsonb, -- NEW: Array of steps (actions/delays)
  is_active boolean default false,
  stats jsonb default '{"runs": 0, "completed": 0}'::jsonb, -- NEW
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- AUDIENCE SEGMENTS (NEW)
create table if not exists audience_segments (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  name text not null,
  description text,
  type text default 'DYNAMIC', -- 'DYNAMIC' or 'MANUAL'
  filters jsonb, -- The query logic (optional for MANUAL)
  criteria jsonb, -- NEW: For MANUAL (includedIds)
  estimated_count integer default 0,
  last_calculated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- EMAIL LOGS (NEW) - For granular tracking
create table if not exists email_logs (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  campaign_id uuid references email_campaigns(id),
  automation_id uuid references marketing_automations(id),
  recipient_email text not null,
  recipient_id uuid, -- Link to client/profile if known
  status text default 'SENT', -- 'SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'BOUNCED'
  opened_at timestamp with time zone,
  clicked_at timestamp with time zone,
  sent_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- AUTOMATION RUNS (NEW) - Execution history
create table if not exists automation_runs (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  automation_id uuid references marketing_automations(id) on delete cascade,
  entity_id uuid, -- The thing that triggered it (client_id, quote_id)
  status text default 'RUNNING', -- 'RUNNING', 'COMPLETED', 'FAILED'
  current_step_index integer default 0,
  logs jsonb default '[]'::jsonb,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- MARKETING TEMPLATES (NEW)
create table if not exists marketing_templates (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid, -- Null for system templates
  name text not null,
  subject text,
  content text not null,
  category text, -- 'NEWSLETTER', 'PROMOTION', 'TRANSACTIONAL'
  thumbnail_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RPC for Joining Company
create or replace function get_company_id_by_code(code_input text)
returns uuid as $$
  select company_id from settings where company_code = code_input limit 1;
$$ language sql security definer;

-- RLS POLICIES (Simplified for Development)
-- In a real app, you would check (auth.uid() -> profile -> company_id)

alter table profiles enable row level security;

drop policy if exists "Users can view their own profile" on profiles;
create policy "Users can view their own profile" on profiles for select using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on profiles;
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on profiles;
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);

-- For other tables, we generally want users to see data from their company.
-- Since we don't have a complex claims system set up yet, we will allow authenticated users to do everything for now to unblock development.
-- IMPORTANT: In production, replace these with proper company_id checks.

drop policy if exists "Enable all access for authenticated users" on profiles;
create policy "Enable all access for authenticated users" on profiles for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on settings;
create policy "Enable all access for authenticated users" on settings for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on clients;
create policy "Enable all access for authenticated users" on clients for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on properties;
create policy "Enable all access for authenticated users" on properties for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on jobs;
create policy "Enable all access for authenticated users" on jobs for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on line_items;
create policy "Enable all access for authenticated users" on line_items for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on checklists;
create policy "Enable all access for authenticated users" on checklists for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on job_photos;
create policy "Enable all access for authenticated users" on job_photos for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on quotes;
create policy "Enable all access for authenticated users" on quotes for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on invoices;
create policy "Enable all access for authenticated users" on invoices for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on payments;
create policy "Enable all access for authenticated users" on payments for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on time_entries;
create policy "Enable all access for authenticated users" on time_entries for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on inventory_products;
create policy "Enable all access for authenticated users" on inventory_products for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on inventory_stock;
create policy "Enable all access for authenticated users" on inventory_stock for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on warehouses;
create policy "Enable all access for authenticated users" on warehouses for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on chats;
create policy "Enable all access for authenticated users" on chats for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on messages;
create policy "Enable all access for authenticated users" on messages for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on email_campaigns;
create policy "Enable all access for authenticated users" on email_campaigns for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on marketing_automations;
create policy "Enable all access for authenticated users" on marketing_automations for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on team_invitations;
create policy "Enable all access for authenticated users" on team_invitations for all using (auth.role() = 'authenticated');

-- Enable RLS on all tables
alter table settings enable row level security;
alter table clients enable row level security;
alter table properties enable row level security;
alter table jobs enable row level security;
alter table line_items enable row level security;
alter table checklists enable row level security;
alter table job_photos enable row level security;
alter table quotes enable row level security;
alter table invoices enable row level security;
alter table payments enable row level security;
alter table time_entries enable row level security;
alter table inventory_products enable row level security;
alter table inventory_stock enable row level security;
alter table warehouses enable row level security;
alter table chats enable row level security;
alter table messages enable row level security;
alter table email_campaigns enable row level security;
alter table marketing_automations enable row level security;
alter table team_invitations enable row level security;
alter table audience_segments enable row level security;
alter table email_logs enable row level security;
alter table automation_runs enable row level security;
alter table marketing_templates enable row level security;

drop policy if exists "Enable all access for authenticated users" on audience_segments;
create policy "Enable all access for authenticated users" on audience_segments for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on email_logs;
create policy "Enable all access for authenticated users" on email_logs for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on automation_runs;
create policy "Enable all access for authenticated users" on automation_runs for all using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on marketing_templates;
create policy "Enable all access for authenticated users" on marketing_templates for all using (auth.role() = 'authenticated');
