import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { sql } = await req.json();
        const SUPABASE_DB_URL = Deno.env.get("SUPABASE_DB_URL");

        if (!SUPABASE_DB_URL) {
            return new Response(JSON.stringify({ error: "SUPABASE_DB_URL not set" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        const client = new Client(SUPABASE_DB_URL);
        await client.connect();
        const result = await client.queryArray(sql);
        await client.end();

        return new Response(JSON.stringify({ success: true, result }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
});
