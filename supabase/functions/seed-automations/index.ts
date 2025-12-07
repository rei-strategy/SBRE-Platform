import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        // 1. Get all companies
        const { data: companies, error: companyError } = await supabase.from("settings").select("company_id");
        if (companyError) throw companyError;

        const results = [];

        for (const { company_id } of companies) {
            // Check if automations exist
            const { count } = await supabase
                .from("marketing_automations")
                .select("*", { count: "exact", head: true })
                .eq("company_id", company_id);

            if (count === 0) {
                // Seed automations
                const automations = [
                    {
                        company_id,
                        name: "New Client Welcome Series",
                        description: "Welcome new clients and introduce your services.",
                        trigger_type: "NEW_CLIENT",
                        is_active: true,
                        steps: [
                            {
                                id: "step_1",
                                type: "EMAIL",
                                config: {
                                    subject: "Welcome to our family!",
                                    content: "<p>Hi {{client.first_name}},</p><p>Thanks for joining us! We are thrilled to have you.</p>"
                                }
                            },
                            { id: "step_2", type: "DELAY", config: { days: 2 } },
                            {
                                id: "step_3",
                                type: "EMAIL",
                                config: {
                                    subject: "How can we help?",
                                    content: "<p>Hi {{client.first_name}},</p><p>Just checking in to see if you need anything.</p>"
                                }
                            }
                        ]
                    },
                    {
                        company_id,
                        name: "Post-Service Follow-Up",
                        description: "Ask for a review after a job is completed.",
                        trigger_type: "JOB_COMPLETED",
                        is_active: true,
                        steps: [
                            { id: "step_1", type: "DELAY", config: { days: 1 } },
                            {
                                id: "step_2",
                                type: "EMAIL",
                                config: {
                                    subject: "How did we do?",
                                    content: "<p>Hi {{client.first_name}},</p><p>We finished the job at {{job.address}}. How was your experience?</p>"
                                }
                            }
                        ]
                    },
                    {
                        company_id,
                        name: "Technician On My Way",
                        description: "Notify client when technician is en route.",
                        trigger_type: "ON_MY_WAY",
                        is_active: true,
                        steps: [
                            {
                                id: "step_1",
                                type: "EMAIL",
                                config: {
                                    subject: "Technician is on the way!",
                                    content: "<p>Hi {{client.first_name}},</p><p>Our technician is on the way to your property.</p>"
                                }
                            }
                        ]
                    },
                    {
                        company_id,
                        name: "Dormant Client Re-engagement",
                        description: "Win back clients who haven't booked in 6 months.",
                        trigger_type: "DORMANT",
                        is_active: true,
                        steps: [
                            {
                                id: "step_1",
                                type: "EMAIL",
                                config: {
                                    subject: "We miss you!",
                                    content: "<p>Hi {{client.first_name}},</p><p>It's been a while. Here is a 10% discount code for your next service.</p>"
                                }
                            }
                        ]
                    },
                    {
                        company_id,
                        name: "Birthday Flow",
                        description: "Send a birthday greeting.",
                        trigger_type: "BIRTHDAY",
                        is_active: true,
                        steps: [
                            {
                                id: "step_1",
                                type: "EMAIL",
                                config: {
                                    subject: "Happy Birthday!",
                                    content: "<p>Hi {{client.first_name}},</p><p>Happy Birthday from the team!</p>"
                                }
                            }
                        ]
                    },
                    {
                        company_id,
                        name: "Quote Follow-Up",
                        description: "Follow up on sent quotes after 3 days.",
                        trigger_type: "QUOTE_SENT",
                        is_active: true,
                        steps: [
                            { id: "step_1", type: "DELAY", config: { days: 3 } },
                            {
                                id: "step_2",
                                type: "EMAIL",
                                config: {
                                    subject: "Any questions about your quote?",
                                    content: "<p>Hi {{client.first_name}},</p><p>Just checking if you had any questions about the quote we sent.</p>"
                                }
                            }
                        ]
                    }
                ];

                const { error } = await supabase.from("marketing_automations").insert(automations);
                if (error) throw error;
                results.push({ company_id, status: "seeded" });
            } else {
                results.push({ company_id, status: "skipped (already exists)" });
            }
        }

        return new Response(JSON.stringify({ success: true, results }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
