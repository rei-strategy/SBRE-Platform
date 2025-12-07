import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { to, subject, html, context = {}, tags = {} } = await req.json();

        if (!to || !subject || !html) {
            throw new Error("Missing required fields: to, subject, html");
        }

        // 1. Variable Replacement
        let finalSubject = subject;
        let finalHtml = html;

        // Helper to replace {{key}} with value
        const replaceVariables = (text: string, data: any, prefix = "") => {
            let result = text;
            for (const [key, value] of Object.entries(data)) {
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    result = replaceVariables(result, value, `${prefix}${key}.`);
                } else {
                    const placeholder = `{{${prefix}${key}}}`;
                    // Global replace
                    result = result.split(placeholder).join(String(value ?? ""));
                }
            }
            return result;
        };

        finalSubject = replaceVariables(finalSubject, context);
        finalHtml = replaceVariables(finalHtml, context);

        // 2. Construct Tags
        const resendTags = [];
        if (tags.workflow) resendTags.push({ name: "workflow", value: tags.workflow });
        if (tags.campaign_id) resendTags.push({ name: "campaign_id", value: tags.campaign_id });
        if (tags.client_id) resendTags.push({ name: "client_id", value: tags.client_id });
        if (tags.job_id) resendTags.push({ name: "job_id", value: tags.job_id });

        // Add any other tags passed
        for (const [key, value] of Object.entries(tags)) {
            if (!['workflow', 'campaign_id', 'client_id', 'job_id'].includes(key)) {
                resendTags.push({ name: key, value: String(value) });
            }
        }

        // 3. Send to Resend
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "MasterClean HQ <no-reply@mastercleanhq.com>",
                to: Array.isArray(to) ? to : [to],
                subject: finalSubject,
                html: finalHtml,
                reply_to: "office@mastercleanhq.com",
                cc: [],
                bcc: [],
                tags: resendTags
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Resend API Error:", data);
            throw new Error(data.message || "Failed to send email");
        }

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error("Email Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
