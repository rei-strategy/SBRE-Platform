-- Inventory System Overhaul Migration

-- 1. Create VENDORS table
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

-- 2. Create PURCHASE_ORDERS table
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

-- 3. Create INVENTORY_HISTORY table (Logs)
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

-- 4. Update INVENTORY_PRODUCTS
alter table inventory_products add column if not exists image_url text;
alter table inventory_products add column if not exists barcode text;
alter table inventory_products add column if not exists description text;

-- Add FK to supplier_id if it doesn't exist (it was defined as uuid in init.sql but no FK)
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints 
    where constraint_name = 'inventory_products_supplier_id_fkey'
  ) then
    alter table inventory_products 
    add constraint inventory_products_supplier_id_fkey 
    foreign key (supplier_id) references vendors(id) on delete set null;
  end if;
end $$;

-- 5. Enable RLS
alter table vendors enable row level security;
alter table purchase_orders enable row level security;
alter table inventory_history enable row level security;

-- 6. RLS Policies (Allow all for authenticated)
create policy "Enable all access for authenticated users" on vendors for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on purchase_orders for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on inventory_history for all using (auth.role() = 'authenticated');
