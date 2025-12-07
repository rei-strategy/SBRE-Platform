import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
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
    const { runId } = await req.json();

    if (!runId) throw new Error("Missing runId");

    // 1. Fetch the Automation Run
    const { data: run, error: runError } = await supabase
      .from("automation_runs")
      .select("*, marketing_automations(*)")
      .eq("id", runId)
      .single();

    if (runError || !run) throw new Error("Run not found");

    const automation = run.marketing_automations;
    const steps = automation.steps;
    const currentStepIndex = run.current_step_index;
    const currentStep = steps[currentStepIndex];

    if (!currentStep) {
      // No more steps, mark as completed
      await supabase.from("automation_runs").update({ status: "COMPLETED", completed_at: new Date().toISOString() }).eq("id", runId);
      return new Response(JSON.stringify({ success: true, message: "Automation completed" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Fetch Context (Client, Job, etc.)
    let client = null;
    let job = null;

    // Try to fetch client
    // Try to fetch client
    if (run.entity_id) {
      // Check if entity is client
      const { data: c } = await supabase.from("clients").select("*").eq("id", run.entity_id).single();
      if (c) client = c;
      else {
        // Check if entity is job
        const { data: j } = await supabase.from("jobs").select("*, clients(*)").eq("id", run.entity_id).single();
        if (j) {
          job = j;
          client = j.clients;
        } else {
          // Check if entity is quote
          const { data: q } = await supabase.from("quotes").select("*, clients(*)").eq("id", run.entity_id).single();
          if (q) {
            // quote = q; // We don't have a quote variable yet, but we can add it if needed. For now just get the client.
            client = q.clients;
          }
        }
      }
    }

    // 2. Evaluate Step Conditions
    let shouldExecute = true;
    if (currentStep.conditions && currentStep.conditions.conditions.length > 0) {
      // We need to evaluate these conditions against the context (client, job, etc.)
      // Since we don't have the full rule engine here, we'll implement a basic evaluator or reuse logic if possible.
      // For now, let's implement a basic evaluator for the common cases.

      const evaluateCondition = (condition: any, context: any): boolean => {
        if ('logic' in condition) { // It's a group
          const results = condition.conditions.map((c: any) => evaluateCondition(c, context));
          return condition.logic === 'AND' ? results.every((r: boolean) => r) : results.some((r: boolean) => r);
        } else { // It's a single condition
          const { resource, field, operator, value } = condition;
          let actualValue: any = null;

          if (resource === 'client' && context.client) actualValue = context.client[field];
          else if (resource === 'job' && context.job) actualValue = context.job[field];
          // Add other resources...

          if (actualValue === undefined || actualValue === null) return false;

          switch (operator) {
            case 'equals': return actualValue == value;
            case 'not_equals': return actualValue != value;
            case 'contains': return String(actualValue).toLowerCase().includes(String(value).toLowerCase());
            case 'gt': return actualValue > value;
            case 'lt': return actualValue < value;
            case 'is_true': return actualValue === true;
            case 'is_false': return actualValue === false;
            default: return false;
          }
        }
      };

      shouldExecute = evaluateCondition(currentStep.conditions, { client, job });
      console.log(`[Automation] Step Condition Evaluation: ${shouldExecute}`);
    }

    if (!shouldExecute) {
      console.log(`[Automation] Skipping step ${currentStepIndex} due to conditions`);
      // Move to next step immediately
      await supabase.from("automation_runs").update({
        current_step_index: currentStepIndex + 1,
        logs: [...(run.logs || []), { step: currentStepIndex, type: currentStep.type, status: "SKIPPED", timestamp: new Date().toISOString() }]
      }).eq("id", runId);

      // Trigger next step
      const nextStep = steps[currentStepIndex + 1];
      if (nextStep) {
        fetch(`${req.url}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': req.headers.get('Authorization') || '' },
          body: JSON.stringify({ runId })
        }).catch(console.error);
      }

      return new Response(JSON.stringify({ success: true, skipped: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // 3. Execute the Step
    console.log(`[Automation] Processing step ${currentStepIndex} (${currentStep.type}) for run ${runId}`);

    let shouldContinue = true; // Default to continue immediately unless it's a delay

    switch (currentStep.type) {
      case 'SEND_EMAIL':
      case 'EMAIL': // Legacy support
        let recipientEmail = client?.email;
        const sendTo = currentStep.config.to || 'client';

        if (sendTo === 'technician') {
          if (job && job.assigned_tech_ids && job.assigned_tech_ids.length > 0) {
            const { data: tech } = await supabase.from('profiles').select('email').eq('id', job.assigned_tech_ids[0]).single();
            if (tech) recipientEmail = tech.email;
          }
        } else if (sendTo === 'custom') {
          recipientEmail = currentStep.config.customEmail;
        }
        // TODO: Handle property_contact when property schema is clear

        if (!recipientEmail) throw new Error(`No email found for recipient type: ${sendTo}`);

        // Prepare Context for Replacement
        const context: any = {
          client: client || {},
          job: job || {},
          company: { name: 'Acme Service Co' } // Placeholder
        };

        // Prepare Tags
        const tags = {
          workflow: automation.id,
          client_id: client?.id,
          job_id: job?.id
        };

        // Invoke send-email function
        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-email', {
          body: {
            to: recipientEmail,
            subject: currentStep.config.subject,
            html: currentStep.config.content,
            context,
            tags
          }
        });

        if (emailError) {
          console.error("Send Email Function Error:", emailError);
          throw new Error("Failed to send email via shared utility");
        }

        // Log
        await supabase.from("email_logs").insert({
          company_id: run.company_id,
          automation_id: automation.id,
          recipient_email: client.email,
          status: "SENT",
          sent_at: new Date().toISOString()
        });
        break;

      case 'SEND_SMS':
        console.log(`[SMS] Would send to ${client?.phone}: ${currentStep.config.message}`);
        // TODO: Implement SMS provider
        break;

      case 'ADD_TAG':
        if (client) {
          const currentTags = client.tags || [];
          if (!currentTags.includes(currentStep.config.tag)) {
            await supabase.from('clients').update({ tags: [...currentTags, currentStep.config.tag] }).eq('id', client.id);
          }
        }
        break;

      case 'REMOVE_TAG':
        if (client) {
          const currentTags = client.tags || [];
          const newTags = currentTags.filter((t: string) => t !== currentStep.config.tag);
          await supabase.from('clients').update({ tags: newTags }).eq('id', client.id);
        }
        break;

      case 'CREATE_TASK':
        await supabase.from('tasks').insert({
          company_id: run.company_id,
          title: currentStep.config.title,
          description: currentStep.config.description,
          related_client_id: client?.id,
          related_job_id: job?.id,
          status: 'PENDING'
        });
        break;

      case 'UPDATE_JOB_STATUS':
        if (job) {
          await supabase.from('jobs').update({ status: currentStep.config.status }).eq('id', job.id);
        }
        break;

      case 'DELAY':
        shouldContinue = false;
        if (currentStep.config.instant) {
          shouldContinue = true; // Skip delay
        } else {
          const now = new Date();
          if (currentStep.config.days) now.setDate(now.getDate() + currentStep.config.days);
          if (currentStep.config.hours) now.setHours(now.getHours() + currentStep.config.hours);
          if (currentStep.config.minutes) now.setMinutes(now.getMinutes() + currentStep.config.minutes);

          await supabase.from("automation_runs").update({
            status: "WAITING",
            next_run_at: now.toISOString(),
            current_step_index: currentStepIndex + 1,
          }).eq("id", runId);
        }
        break;

      case 'WAIT_UNTIL':
        // TODO: Implement specific time logic
        shouldContinue = false;
        // For now, treat as 1 hour delay
        const waitTime = new Date();
        waitTime.setHours(waitTime.getHours() + 1);
        await supabase.from("automation_runs").update({
          status: "WAITING",
          next_run_at: waitTime.toISOString(),
          current_step_index: currentStepIndex + 1,
        }).eq("id", runId);
        break;
    }

    if (shouldContinue) {
      // Move to next step
      await supabase.from("automation_runs").update({
        current_step_index: currentStepIndex + 1,
        logs: [...(run.logs || []), { step: currentStepIndex, type: currentStep.type, status: "SUCCESS", timestamp: new Date().toISOString() }]
      }).eq("id", runId);

      // Trigger next step
      const nextStep = steps[currentStepIndex + 1];
      if (nextStep) {
        fetch(`${req.url}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': req.headers.get('Authorization') || '' },
          body: JSON.stringify({ runId })
        }).catch(console.error);
      }
    }

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error: any) {
    console.error("Automation Error:", error);

    // Attempt to log the error to the database so it appears in the UI
    try {
      if (req.method === "POST") {
        const { runId } = await req.clone().json();
        if (runId) {
          const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

          // Fetch current logs first to append
          const { data: run } = await supabase.from("automation_runs").select("logs").eq("id", runId).single();
          const currentLogs = run?.logs || [];

          await supabase.from("automation_runs").update({
            status: "FAILED",
            completed_at: new Date().toISOString(),
            logs: [...currentLogs, {
              step: "ERROR",
              status: "FAILED",
              error: error.message,
              timestamp: new Date().toISOString()
            }]
          }).eq("id", runId);
        }
      }
    } catch (logError) {
      console.error("Failed to log error to DB:", logError);
    }

    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
