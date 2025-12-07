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
        const { campaignId } = await req.json();

        // 1. Fetch Campaign Details
        const { data: campaign, error: campaignError } = await supabase
            .from("email_campaigns")
            .select("*")
            .eq("id", campaignId)
            .single();

        if (campaignError || !campaign) throw new Error("Campaign not found");

        let recipientIds: string[] = [];

        // 2. Resolve Audience
        if (campaign.audience_id) {
            const { data: segment, error: segmentError } = await supabase
                .from("audience_segments")
                .select("*")
                .eq("id", campaign.audience_id)
                .single();

            if (segmentError || !segment) throw new Error("Audience segment not found");

            if (segment.type === 'MANUAL' && segment.criteria && segment.criteria.includedIds) {
                recipientIds = segment.criteria.includedIds;
            } else {
                // DYNAMIC segment - for now, fetch all clients (or implement filter logic here)
                // TODO: Implement full filter logic
                const { data: allClients } = await supabase.from("clients").select("id").eq("company_id", campaign.company_id);
                recipientIds = allClients?.map(c => c.id) || [];
            }
        } else if (campaign.audience_filter && campaign.audience_filter.includedIds) {
            // Ad-hoc audience (Direct selection)
            recipientIds = campaign.audience_filter.includedIds;
        } else {
            throw new Error("Campaign has no audience selected");
        }

        if (recipientIds.length === 0) {
            console.log("No recipients found for campaign", campaignId);
            return new Response(JSON.stringify({ success: true, results: [], message: "No recipients found" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 3. Fetch Recipients (Clients)
        const { data: clients, error: clientsError } = await supabase
            .from("clients")
            .select("*")
            .in("id", recipientIds);

        if (clientsError || !clients) throw new Error("Recipients not found");

        const results = [];

        // 3. Send Emails Loop
        for (const client of clients) {
            if (!client.email) continue;

            // Prepare Context
            const context: any = {
                first_name: client.first_name || "there",
                company_name: client.company_name || "",
                // Add other client fields as needed
            };

            // Prepare Tags
            const tags = {
                campaign_id: campaign.id,
                client_id: client.id
            };

            try {
                const { data: emailData, error: emailError } = await supabase.functions.invoke('send-email', {
                    body: {
                        to: client.email,
                        subject: campaign.subject,
                        html: campaign.content || "",
                        context,
                        tags
                    }
                });

                if (emailError) {
                    console.error("Send Email Function Error:", emailError);
                    results.push({ email: client.email, status: "failed", error: emailError });
                } else {
                    // Log success
                    await supabase.from("email_logs").insert({
                        company_id: campaign.company_id,
                        campaign_id: campaign.id,
                        recipient_email: client.email,
                        recipient_id: client.id,
                        status: 'SENT',
                        sent_at: new Date().toISOString()
                    });
                    results.push({ email: client.email, status: "sent", id: emailData.id });
                }

            } catch (e: any) {
                console.error("Send Error", e);
                results.push({ email: client.email, status: "failed", error: e.message });
            }
        }

        // 4. Update Campaign Stats
        const sentCount = results.filter(r => r.status === "sent").length;
        await supabase.from("email_campaigns").update({
            status: 'SENT',
            sent_count: campaign.sent_count + sentCount
        }).eq("id", campaignId);

        return new Response(JSON.stringify({ success: true, results }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Critical Error in send-campaign:", error);

        // Attempt to update status to FAILED
        try {
            const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
            const { campaignId } = await req.json();
            if (campaignId) {
                await supabase.from("email_campaigns").update({
                    status: 'FAILED',
                    settings: { error: error.message }
                }).eq("id", campaignId);
            }
        } catch (updateError) {
            console.error("Failed to update campaign status to FAILED:", updateError);
        }

        return new Response(JSON.stringify({ success: false, error: error.message, stack: error.stack }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
