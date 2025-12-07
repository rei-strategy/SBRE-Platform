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
        const { tone, topic, context } = await req.json();

        if (!GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not configured");
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
      You are an expert email copywriter. Generate a professional and engaging email subject and body based on the following parameters:
      
      Tone: ${tone}
      Topic: ${topic}
      Context/Details: ${context || "None provided"}
      
      Return the response in strictly valid JSON format with the following structure:
      {
        "subject": "The email subject line",
        "content": "The email body content (can include HTML for formatting like <br>, <b>, etc.)"
      }
      
      Do not include markdown code blocks (like \`\`\`json). Just return the raw JSON string.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up potential markdown code blocks if the model includes them
        text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");

        return new Response(text, {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error generating email:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
