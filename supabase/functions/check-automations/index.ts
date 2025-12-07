import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // 1. Find pending runs that are due
    const { data: runs, error } = await supabase
      .from("automation_runs")
      .select("id")
      .eq("status", "WAITING")
      .lte("next_run_at", new Date().toISOString());

    if (error) throw error;

    console.log(`Found ${runs?.length || 0} pending runs.`);

    // 2. Trigger process-automation for each
    const results = [];
    for (const run of runs || []) {
      // Update status to RUNNING to prevent double processing
      await supabase.from("automation_runs").update({ status: "RUNNING" }).eq("id", run.id);

      // Call process-automation
      const res = await fetch(`${SUPABASE_URL}/functions/v1/process-automation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ runId: run.id }),
      });
      results.push({ id: run.id, status: res.status });
    }

    // 3. CHECK FOR BIRTHDAYS (New Logic)
    const today = new Date();
    const month = today.getMonth() + 1; // 1-12
    const day = today.getDate(); // 1-31

    // Get active birthday automations
    const { data: birthdayAutomations } = await supabase
      .from('marketing_automations')
      .select('id, company_id')
      .eq('trigger_type', 'BIRTHDAY')
      .eq('is_active', true);

    if (birthdayAutomations && birthdayAutomations.length > 0) {
      for (const automation of birthdayAutomations) {
        // Find clients with birthday today using RPC
        const { data: birthdayClients, error: rpcError } = await supabase
          .rpc('get_clients_with_birthday', {
            p_company_id: automation.company_id,
            p_month: month,
            p_day: day
          });

        if (rpcError) {
          console.error("Error fetching birthday clients:", rpcError);
          continue;
        }

        if (birthdayClients) {
          for (const client of birthdayClients) {
            // Check if we already ran this automation for this client THIS YEAR
            // We can check automation_runs created_at year
            const startOfYear = new Date(today.getFullYear(), 0, 1).toISOString();
            const { data: existingRun } = await supabase
              .from('automation_runs')
              .select('id')
              .eq('automation_id', automation.id)
              .eq('entity_id', client.id)
              .gte('created_at', startOfYear)
              .single();

            if (!existingRun) {
              // Create new run
              const { data: newRun } = await supabase
                .from('automation_runs')
                .insert({
                  company_id: automation.company_id,
                  automation_id: automation.id,
                  entity_id: client.id,
                  status: 'RUNNING',
                  current_step_index: 0,
                  logs: [{ step: 'INIT', status: 'STARTED', timestamp: new Date().toISOString(), trigger: 'BIRTHDAY' }]
                })
                .select()
                .single();

              if (newRun) {
                // Trigger process-automation immediately
                await fetch(`${SUPABASE_URL}/functions/v1/process-automation`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                  },
                  body: JSON.stringify({ runId: newRun.id }),
                });
                results.push({ id: newRun.id, type: 'BIRTHDAY_TRIGGER', client: client.id });
              }
            }
          }
        }
      }
    }

    return new Response(JSON.stringify({ success: true, processed: results.length }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
