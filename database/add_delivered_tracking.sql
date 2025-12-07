-- Add delivered_at to email_logs
alter table email_logs add column if not exists delivered_at timestamp with time zone;

-- Add delivered_count to email_campaigns
alter table email_campaigns add column if not exists delivered_count integer default 0;

-- Create RPC to increment delivered count
create or replace function increment_delivered_count(campaign_id uuid)
returns void as $$
begin
  update email_campaigns
  set delivered_count = delivered_count + 1
  where id = campaign_id;
end;
$$ language plpgsql security definer;
