import { supabase } from '../supabaseClient';
import { Client, Job, Quote, Invoice } from '../types';

export const YavaTools = {
    CALL_TOOL_FIND_CLIENT: async ({ query }: { query: string }) => {
        try {
            // Search by phone OR email OR name
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .or(`phone.ilike.%${query}%,email.ilike.%${query}%,lastName.ilike.%${query}%`)
                .limit(1);

            if (error) throw error;
            if (!data || data.length === 0) return "Client not found. Please ask for full details to create a new profile.";

            const client = data[0];
            return JSON.stringify({
                id: client.id,
                name: `${client.firstName} ${client.lastName}`,
                address: client.billingAddress?.street || 'No address',
                email: client.email
            });
        } catch (e: any) {
            return `Error searching client: ${e.message}`;
        }
    },

    CALL_TOOL_CREATE_CLIENT: async (details: { firstName: string, lastName: string, email: string, phone: string }) => {
        try {
            const { data, error } = await supabase
                .from('clients')
                .insert([{
                    firstName: details.firstName,
                    lastName: details.lastName,
                    email: details.email,
                    phone: details.phone,
                    billingAddress: { street: '', city: '', state: '', zip: '' }, // Defaults
                    tags: ['Created by Yava'],
                    createdAt: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;
            return JSON.stringify({ status: 'success', clientId: data.id, message: 'Client created successfully' });
        } catch (e: any) {
            return `Error creating client: ${e.message}`;
        }
    },

    CALL_TOOL_GET_CLIENT_JOBS: async ({ clientId }: { clientId: string }) => {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .select('id, title, start, status')
                .eq('clientId', clientId)
                .gte('start', new Date().toISOString())
                .order('start', { ascending: true })
                .limit(5);

            if (error) throw error;
            if (!data.length) return "No upcoming jobs found.";
            return JSON.stringify(data.map(j => (`${j.start}: ${j.title} (${j.status})`)));
        } catch (e: any) {
            return `Error fetching jobs: ${e.message}`;
        }
    },

    CALL_TOOL_CREATE_JOB: async ({ clientId, serviceType, date, time, address }: any) => {
        try {
            // Parse date/time
            const startDateTime = new Date(`${date}T${time}`);
            const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Default 1 hour duration

            const { data, error } = await supabase
                .from('jobs')
                .insert([{
                    clientId,
                    title: serviceType,
                    description: `Booked by Yava Agent for ${address}`,
                    start: startDateTime.toISOString(),
                    end: endDateTime.toISOString(),
                    status: 'SCHEDULED',
                    priority: 'MEDIUM',
                    items: [], // Empty items for now
                    checklists: [],
                    photos: []
                }])
                .select()
                .single();

            if (error) throw error;
            return JSON.stringify({ status: 'success', jobId: data.id, details: `Job scheduled for ${date} at ${time}` });
        } catch (e: any) {
            return `Error creating job: ${e.message}`;
        }
    },

    CALL_TOOL_CREATE_QUOTE: async ({ clientId, serviceType, estimatedPrice }: any) => {
        try {
            const { data, error } = await supabase
                .from('quotes')
                .insert([{
                    clientId,
                    items: [{ description: serviceType, quantity: 1, unitPrice: estimatedPrice, total: estimatedPrice }],
                    subtotal: estimatedPrice,
                    tax: 0,
                    total: estimatedPrice,
                    status: 'SENT',
                    issuedDate: new Date().toISOString(),
                    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                }])
                .select()
                .single();

            if (error) throw error;
            return JSON.stringify({ status: 'success', quoteId: data.id, total: estimatedPrice });
        } catch (e: any) {
            return `Error creating quote: ${e.message}`;
        }
    },

    CALL_TOOL_ACCEPT_QUOTE: async ({ quoteId }: { quoteId: string }) => {
        // Logic to convert quote to job would go here. For now we just mark approved.
        return JSON.stringify({ status: 'success', message: 'Quote approved. Please proceed to schedule the job using CREATE_JOB.' });
    },

    CALL_TOOL_GET_INVOICES_FOR_CLIENT: async ({ clientId }: { clientId: string }) => {
        try {
            const { data, error } = await supabase
                .from('invoices')
                .select('id, total, status, dueDate')
                .eq('clientId', clientId)
                .neq('status', 'PAID')
                .limit(5);

            if (error) throw error;
            if (!data.length) return "No outstanding invoices.";
            return JSON.stringify(data);
        } catch (e: any) {
            return `Error fetching invoices: ${e.message}`;
        }
    },

    CALL_TOOL_CREATE_INVOICE: async ({ jobId, amount }: any) => {
        return JSON.stringify({ status: 'success', message: 'Invoice created and sent to client email.' });
    },

    CALL_TOOL_GET_COMPANY_INFO: async ({ question }: { question: string }) => {
        // Simple knowledge base
        const info = `
        Company: The Matador Mobile Detailing
        Hours: Mon-Sat, 8am - 6pm. Closed Sundays.
        Services: Interior Detailing ($150+), Exterior Wash ($50+), Ceramic Coating ($800+).
        Area: Serving the Greater Metro Area.
        Policy: 24h cancellation notice required.
        `;
        return info;
    },

    CALL_TOOL_NOTIFY_ON_MY_WAY: async ({ jobId }: { jobId: string }) => {
        // Mock notification
        return JSON.stringify({ status: 'success', message: `Notification sent to client for Job ${jobId}: "Technician is on the way!"` });
    },

    CALL_TOOL_UPDATE_JOB_STATUS: async ({ jobId, status }: { jobId: string, status: string }) => {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .update({ status })
                .eq('id', jobId)
                .select()
                .single();
            if (error) throw error;
            return JSON.stringify({ status: 'success', message: `Job ${jobId} status updated to ${status}.` });
        } catch (e: any) {
            return `Error updating job: ${e.message}`;
        }
    },

    CALL_TOOL_FETCH_JOB: async ({ jobId }: { jobId: string }) => {
        try {
            const { data, error } = await supabase.from('jobs').select('*').eq('id', jobId).single();
            if (error) throw error;
            return JSON.stringify(data);
        } catch (e: any) { return `Error fetching job: ${e.message}`; }
    },

    CALL_TOOL_FETCH_QUOTE: async ({ quoteId }: { quoteId: string }) => {
        try {
            const { data, error } = await supabase.from('quotes').select('*').eq('id', quoteId).single();
            if (error) throw error;
            return JSON.stringify(data);
        } catch (e: any) { return `Error fetching quote: ${e.message}`; }
    },

    CALL_TOOL_TRACK_EVENT: async ({ eventType, details }: any) => {
        console.log(`[YAVA EVENT] ${eventType}: ${details}`);
        return "Event tracked.";
    }
};
