-- Enable pg_cron and pg_net extensions
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Schedule the check-automations function to run every minute
-- Note: We assume the function is deployed with --no-verify-jwt or we would need to pass the service key
-- Since we deployed with --no-verify-jwt, we can skip the Authorization header for the trigger.
-- Security Note: In production, you might want to enable JWT verification and store the key in a secure vault, 
-- or use a specific internal secret header.

select cron.schedule(
  'check-automations-every-minute',
  '* * * * *', -- Every minute
  $$
  select
    net.http_post(
      url:='https://wumwjhdzihawygsmwfkn.supabase.co/functions/v1/check-automations',
      headers:='{"Content-Type": "application/json"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);
