import { supabase } from '../supabaseClient';
import { ResearchToolType, ResearchResult } from '../types';

const PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;

// Cache duration in milliseconds (e.g., 24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

interface PromptTemplate {
    system: string;
    user: (inputs: Record<string, string>) => string;
}

const PROMPTS: Record<ResearchToolType, PromptTemplate> = {
    'competitor-insights': {
        system: "You are a market research expert. return valid JSON only.",
        user: (inputs) => `
Analyze the top 3–10 competitors for a field-service company in the following city and service niche. Identify:
- Whether they are running ads
- What offers or promotions they are pushing
- Their strongest differentiators
- Weaknesses
- Website presence quality
- Review sentiment
- Average pricing indicators
- Growth opportunities for our business
Return data in a structured JSON format:
{ "competitors": [{ "name": "...", "ads_running": true, "offers": "...", "differentiators": "...", "weaknesses": "...", "website_quality": "...", "sentiment": "...", "price_indicator": "..." }], "opportunities": ["..."] }
CITY = ${inputs.city}
SERVICE = ${inputs.service}
    `
    },
    'market-trends': {
        system: "You are a market trend analyst. return valid JSON only.",
        user: (inputs) => `
Identify the top current and emerging trends for the following service industry in the specified city and region.
Include seasonality, demand spikes, search volume direction, and macroeconomic influences.
Return in JSON format with fields: { "short_term_trends": [], "long_term_trends": [], "seasonality": "...", "demand_shift": "...", "recommendations": [] }.
CITY = ${inputs.city}
SERVICE = ${inputs.service}
    `
    },
    'keyword-discovery': {
        system: "You are an SEO expert. return valid JSON only.",
        user: (inputs) => `
Generate a keyword intelligence report for ${inputs.service} businesses in ${inputs.city}.
Return:
- High-intent keywords
- Local modifiers
- Competitor-targeted keywords
- Long-tail keywords
- Estimated search intent
- Advertising difficulty
Return JSON formatted: { "keywords": [{ "term": "...", "type": "high-intent/local/etc", "volume_est": "high/med/low" }], "difficulty_scores": { "overall": 0-100 }, "recommendations": [] }
    `
    },
    'business-audit': {
        system: "You are a business consultant. return valid JSON only.",
        user: (inputs) => `
Perform a full business audit for this field-service company using the provided business description and website (if any).
Audit marketing, operations, reviews, pricing, customer journey, branding, SEO, and retention.
Return JSON:
{ "strengths": [], "weaknesses": [], "risks": [], "opportunities": [], "roadmap_30_days": [], "roadmap_90_days": [] }
BUSINESS_INFO = ${inputs.business_info}
    `
    },
    'pricing-benchmarks': {
        system: "You are a pricing analyst. return valid JSON only.",
        user: (inputs) => `
Research typical pricing ranges for ${inputs.service} businesses in ${inputs.city}.
Return:
- Standard pricing
- Competitor pricing indicators
- Premium vs budget segments
- Opportunity pricing zones
Return JSON: { "pricing_matrix": [{ "service": "...", "low": "...", "average": "...", "high": "..." }], "segments": [], "recommendations": [] }
CITY = ${inputs.city}
    `
    },
    'seo-audit': {
        system: "You are an SEO auditor. return valid JSON only.",
        user: (inputs) => `
Analyze the SEO posture of this business website and compare it to 3–5 competitors.
Evaluate domain authority, top pages, keyword targeting, backlink profile, and content gaps.
Return JSON:
{ "site_score": 0-100, "competitors": [], "keywords_missing": [], "content_gaps": [], "recommendations": [] }
WEBSITE = ${inputs.website}
    `
    },
    'opportunity-finder': {
        system: "You are a growth strategist. return valid JSON only.",
        user: (inputs) => `
Identify the highest-value marketing and operational opportunities for ${inputs.service} in ${inputs.city} based on demand shifts, competition weakness, search volume, and local economics.
Return JSON with score from 0–100 and: { "score": 85, "opportunities": [], "risks": [], "recommended_campaigns": [], "recommended_services": [] }
    `
    },
    'growth-plan-generator': {
        system: "You are a business scaler. return valid JSON only.",
        user: (inputs) => `
Using the business description and service niche, generate a 30-day and 90-day growth plan including marketing, operations, retention, pricing, upsells, and reviews.
Return JSON:
{ "plan_30": [{ "day": "1-7", "focus": "...", "tasks": [] }], "plan_90": [], "KPIs": [], "risks": [], "high_impact_actions": [] }
BUSINESS_INFO = ${inputs.business_info}
    `
    }
};

export const ResearchService = {

    async runResearch(tool: ResearchToolType, inputs: Record<string, string>, userId: string, companyId?: string): Promise<ResearchResult> {

        // 1. CHECK CACHE
        // We check if we have a recent result for this user/tool/input combo
        // Ideally we hash the input payload for deeper equality check, but for now simple JSON string match is okay for MVP
        const { data: cached } = await supabase
            .from('research_history')
            .select('*')
            .eq('tool_type', tool)
            .eq('user_id', userId)
            .gt('created_at', new Date(Date.now() - CACHE_DURATION).toISOString())
            .order('created_at', { ascending: false })
            .limit(1);

        // Filter by input payload match in JS (Supabase JSONB filtering can be tricky with exact matches)
        const matchingCache = cached?.find(c => JSON.stringify(c.input_payload) === JSON.stringify(inputs));

        if (matchingCache) {
            console.log('Returning cached research result');
            return {
                id: matchingCache.id,
                toolType: tool,
                data: matchingCache.output_payload,
                createdAt: matchingCache.created_at
            };
        }

        // 2. CALL API
        const prompt = PROMPTS[tool];
        if (!prompt) throw new Error(`Unknown tool: ${tool}`);

        const systemMsg = prompt.system;
        const userMsg = prompt.user(inputs);

        const resultData = await this.callPerplexity(systemMsg, userMsg);

        // 3. SAVE TO DB
        const { data: saved, error } = await supabase
            .from('research_history')
            .insert({
                user_id: userId,
                company_id: companyId,
                tool_type: tool,
                input_payload: inputs,
                output_payload: resultData
            })
            .select()
            .single();

        if (error) {
            console.error('Failed to save research history', error);
            // Return the result even if save failed
            return {
                id: 'temp-' + Date.now(),
                toolType: tool,
                data: resultData,
                createdAt: new Date().toISOString()
            };
        }

        return {
            id: saved.id,
            toolType: tool,
            data: saved.output_payload,
            createdAt: saved.created_at
        };
    },

    async callPerplexity(systemMsg: string, userMsg: string): Promise<any> {
        if (!PERPLEXITY_API_KEY) {
            console.warn("Missing Perplexity API Key");
            return { error: "Missing API key" };
        }

        try {
            const response = await fetch("https://api.perplexity.ai/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "sonar-deep-research",
                    messages: [
                        { role: "system", content: systemMsg },
                        { role: "user", content: userMsg }
                    ],
                    temperature: 0.3,
                    max_tokens: 4000,
                    top_p: 0.9,
                    return_citations: false
                })
            });

            // Always read JSON (even on 400/500)
            const json = await response.json();

            // If API returned an error payload
            if (!response.ok) {
                console.error("Perplexity API Error:", json);
                return { error: json?.error || json?.message || "Unknown Perplexity Error" };
            }

            const content = json?.choices?.[0]?.message?.content || "";

            // Clean fenced JSON blocks
            const cleaned = content.replace(/```json|```/g, "").trim();

            try {
                return JSON.parse(cleaned);
            } catch (err) {
                console.warn("Could not parse JSON; returning raw text.");
                return { raw: cleaned };
            }

        } catch (err: any) {
            console.error("Perplexity Request Failed:", err);
            return { error: err.message || "Network error" };
        }
    },

    async getHistory(userId: string): Promise<ResearchResult[]> {
        const { data } = await supabase
            .from('research_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        return (data || []).map(row => ({
            id: row.id,
            toolType: row.tool_type as ResearchToolType,
            data: row.output_payload,
            createdAt: row.created_at
        }));
    }
};
