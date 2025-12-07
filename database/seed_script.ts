import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const SUPABASE_URL = "http://127.0.0.1:54321";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function seed() {
    console.log("Starting seed...");

    // 1. Get all companies
    const { data: companies, error: companyError } = await supabase.from("settings").select("company_id");
    if (companyError) {
        console.error("Error fetching companies:", companyError);
        return;
    }

    console.log(`Found ${companies.length} companies.`);

    for (const { company_id } of companies) {
        console.log(`Checking company: ${company_id}`);

        // Check if automations exist
        const { count } = await supabase
            .from("marketing_automations")
            .select("*", { count: "exact", head: true })
            .eq("company_id", company_id);

        if (count === 0) {
            console.log(`Seeding automations for ${company_id}...`);
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
            if (error) {
                console.error(`Error seeding ${company_id}:`, error);
            } else {
                console.log(`Seeded ${company_id} successfully.`);
            }
        } else {
            console.log(`Skipping ${company_id} (already has ${count} automations).`);
        }
    }
    console.log("Done.");
}

seed();
