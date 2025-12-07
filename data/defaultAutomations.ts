import { MarketingAutomation } from '../types';

export const defaultAutomations: Omit<MarketingAutomation, 'id' | 'createdAt' | 'stats' | 'companyId'>[] = [
    {
        name: "New Client Welcome Series",
        description: "Welcome new clients and introduce your services.",
        triggerType: "NEW_CLIENT",
        isActive: true,
        triggerConfig: {},
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
        name: "Post-Service Follow-Up",
        description: "Ask for a review after a job is completed.",
        triggerType: "JOB_COMPLETED",
        isActive: true,
        triggerConfig: {},
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
        name: "Technician On My Way",
        description: "Notify client when technician is en route.",
        triggerType: "ON_MY_WAY",
        isActive: true,
        triggerConfig: {},
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
        name: "Dormant Client Re-engagement",
        description: "Win back clients who haven't booked in 6 months.",
        triggerType: "DORMANT",
        isActive: true,
        triggerConfig: {},
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
        name: "Birthday Flow",
        description: "Send a birthday greeting.",
        triggerType: "BIRTHDAY",
        isActive: true,
        triggerConfig: {},
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
        name: "Quote Follow-Up",
        description: "Follow up on sent quotes after 3 days.",
        triggerType: "QUOTE_SENT",
        isActive: true,
        triggerConfig: {},
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
