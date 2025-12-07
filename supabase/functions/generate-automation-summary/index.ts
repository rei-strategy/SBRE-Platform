import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { automation } = await req.json();

        if (!GEMINI_API_KEY) {
            return new Response(JSON.stringify({
                summary: "Gemini API Key not configured. Please add GEMINI_API_KEY to your Edge Function secrets."
            }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
      You are an expert automation assistant. Explain the following marketing automation workflow in simple, clear, and professional natural language for a business owner.
      Focus on "When this happens...", "Then...", and "Finally...".
      Avoid technical jargon like "JSON", "array", "object".
      
      Automation Data:
      ${JSON.stringify(automation, null, 2)}
      
      Keep the summary under 3 sentences if possible.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return new Response(JSON.stringify({ summary: text }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Error generating summary:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
});
