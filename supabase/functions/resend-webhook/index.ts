import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const payload = await req.json();
        const type = payload.type;
        const data = payload.data;

        if (!type || !data) {
            return new Response("Invalid payload", { status: 400, headers: corsHeaders });
        }

        console.log(`Received webhook: ${type}`, data);

        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

        // Extract tags to identify campaign and recipient
        let campaignId = null;
        let automationId = null;
        let recipientId = null;

        if (data.tags) {
            // Robust tag extraction (Array or Object)
            if (Array.isArray(data.tags)) {
                for (const tag of data.tags) {
                    if (tag.name === 'campaign_id') campaignId = tag.value;
                    if (tag.name === 'workflow') automationId = tag.value;
                    if (tag.name === 'client_id') recipientId = tag.value;
                    if (tag.name === 'recipient_id') recipientId = tag.value; // Legacy support
                }
            } else if (typeof data.tags === 'object') {
                campaignId = data.tags.campaign_id;
                automationId = data.tags.workflow;
                recipientId = data.tags.client_id || data.tags.recipient_id;
            }
        }

        if (!campaignId && !automationId) {
            console.log("No campaign_id or workflow tag found, skipping.");
            return new Response("No ID found", { status: 200, headers: corsHeaders });
        }

        // Find the log entry
        let query = supabase.from("email_logs").select("id");

        if (campaignId) {
            query = query.eq("campaign_id", campaignId);
        } else if (automationId) {
            query = query.eq("automation_id", automationId);
        }

        if (recipientId) {
            query = query.eq("recipient_id", recipientId);
        } else if (data.to && data.to.length > 0) {
            query = query.eq("recipient_email", data.to[0]);
        }

        const { data: logs, error: logError } = await query.limit(1);

        if (logError || !logs || logs.length === 0) {
            console.log("Log entry not found", logError);
            return new Response(JSON.stringify({
                success: false,
                message: "Log entry not found",
                debug: { campaignId, recipientId, email: data.to?.[0] }
            }), {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            })
        }

        const logId = logs[0].id;

        if (type === 'email.opened') {
            await supabase.from("email_logs").update({
                status: 'OPENED',
                opened_at: data.created_at || new Date().toISOString()
            }).eq("id", logId);

            if (campaignId) {
                await supabase.rpc('increment_open_count', { campaign_id: campaignId });
            }
        }
        else if (type === 'email.clicked') {
            await supabase.from("email_logs").update({
                status: 'CLICKED',
                clicked_at: data.created_at || new Date().toISOString()
            }).eq("id", logId);

            if (campaignId) {
                await supabase.rpc('increment_click_count', { campaign_id: campaignId });
            }
        }
        else if (type === 'email.bounced') {
            await supabase.from("email_logs").update({
                status: 'BOUNCED',
                error_message: JSON.stringify(data.bounce)
            }).eq("id", logId);
        }
        else if (type === 'email.delivered') {
            await supabase.from("email_logs").update({
                status: 'DELIVERED',
                delivered_at: data.created_at || new Date().toISOString()
            }).eq("id", logId);

            if (campaignId) {
                await supabase.rpc('increment_delivered_count', { campaign_id: campaignId });
            }
        }

        return new Response(JSON.stringify({
            success: true,
            logId: logId,
            message: "Updated log status to " + type
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error("Webhook Error", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
});
