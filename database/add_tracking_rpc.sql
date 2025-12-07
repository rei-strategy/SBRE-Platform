-- Create email_logs table if it doesn't exist
create table if not exists email_logs (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid not null,
  campaign_id uuid not null references email_campaigns(id) on delete cascade,
  recipient_email text not null,
  recipient_id uuid,
  status text default 'SENT', -- 'SENT', 'OPENED', 'CLICKED', 'BOUNCED'
  sent_at timestamp with time zone default timezone('utc'::text, now()) not null,
  opened_at timestamp with time zone,
  clicked_at timestamp with time zone,
  error_message text
);

-- Enable RLS
alter table email_logs enable row level security;

-- Policy for email_logs
drop policy if exists "Enable all access for authenticated users" on email_logs;
create policy "Enable all access for authenticated users" on email_logs for all using (auth.role() = 'authenticated');

-- Function to increment open count
create or replace function increment_open_count(campaign_id uuid)
returns void as $$
begin
  update email_campaigns
  set open_count = open_count + 1
  where id = campaign_id;
end;
$$ language plpgsql security definer;

-- Function to increment click count
create or replace function increment_click_count(campaign_id uuid)
returns void as $$
begin
  update email_campaigns
  set click_count = click_count + 1
  where id = campaign_id;
end;
$$ language plpgsql security definer;
