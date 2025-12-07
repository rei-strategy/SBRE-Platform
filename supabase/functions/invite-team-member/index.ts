import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // Handle CORS preflight request
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
        const { email, name, companyName, inviteCode } = await req.json();

        if (!RESEND_API_KEY) {
            console.error("Missing RESEND_API_KEY");
            return new Response(
                JSON.stringify({ error: "Server configuration error: Missing Email API Key" }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // Prepare Context
        const context = {
            company_name: companyName,
            invite_code: inviteCode
        };

        // Prepare Tags
        const tags = {
            type: 'invite',
            company_name: companyName
        };

        const { data, error } = await supabase.functions.invoke('send-email', {
            body: {
                to: email,
                subject: `Join ${companyName} on Gitta Job`,
                html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>You've been invited!</h1>
            <p><strong>{{company_name}}</strong> has invited you to join their team on Gitta Job.</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="margin-bottom: 10px; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Company Code</p>
              <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #4f46e5; margin: 0;">{{invite_code}}</p>
            </div>

            <p>To join:</p>
            <ol>
              <li>Download the Gitta Job app or go to the website.</li>
              <li>Select <strong>"Join Existing Team"</strong>.</li>
              <li>Enter the code above.</li>
            </ol>
            
            <p>See you there!</p>
          </div>
        `,
                context,
                tags
            }
        });

        if (error) {
            console.error("Send Email Function Error:", error);
            return new Response(JSON.stringify({ error }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
