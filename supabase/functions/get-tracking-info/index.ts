import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const { token } = await req.json();

        if (!token) {
            throw new Error('Token is required');
        }

        // 1. Verify Token
        const { data: linkData, error: linkError } = await supabase
            .from('job_tracking_links')
            .select('job_id, expires_at')
            .eq('token', token)
            .single();

        if (linkError || !linkData) {
            return new Response(JSON.stringify({ error: 'Invalid or expired link' }), {
                status: 404,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        if (new Date(linkData.expires_at) < new Date()) {
            return new Response(JSON.stringify({ error: 'Link has expired' }), {
                status: 410,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // 2. Fetch Job Details
        const { data: jobData, error: jobError } = await supabase
            .from('jobs')
            .select(`
        id, 
        title, 
        status, 
        start_time, 
        end_time,
        assigned_tech_ids,
        client_id,
        property_id
      `)
            .eq('id', linkData.job_id)
            .single();

        if (jobError || !jobData) {
            throw new Error('Job not found');
        }

        // 3. Fetch Property Location (Destination)
        // We need to fetch client -> properties to get the lat/lng of the job
        // Or if we have a direct way. The schema has clients(properties jsonb) or similar?
        // Let's assume we need to fetch the client and find the property.
        // Actually, `clients` table has `properties` column which is JSONB array.

        const { data: clientData } = await supabase
            .from('clients')
            .select('properties')
            .eq('id', jobData.client_id)
            .single();

        let jobLocation = null;
        if (clientData?.properties) {
            const prop = clientData.properties.find((p: any) => p.id === jobData.property_id);
            if (prop?.address?.lat && prop?.address?.lng) {
                jobLocation = { lat: prop.address.lat, lng: prop.address.lng, address: prop.address.street };
            }
        }

        // 4. Fetch Tech Details (if assigned)
        let techInfo = null;
        const techId = jobData.assigned_tech_ids?.[0];

        if (techId) {
            const { data: techData } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url')
                .eq('id', techId)
                .single();

            if (techData) {
                techInfo = {
                    name: techData.full_name,
                    avatarUrl: techData.avatar_url,
                    location: null as any
                };

                // 5. Security Check: Only show location if active
                const activeStatuses = ['IN_PROGRESS', 'EN_ROUTE']; // Add EN_ROUTE if it exists in types, otherwise just IN_PROGRESS
                // Checking types.ts or previous context... usually it's SCHEDULED, IN_PROGRESS, COMPLETED.
                // Let's assume IN_PROGRESS is the main one.

                if (jobData.status === 'IN_PROGRESS') {
                    // Fetch latest GPS
                    const { data: gpsData } = await supabase
                        .from('time_entries')
                        .select('gps_location')
                        .eq('user_id', techId)
                        .not('gps_location', 'is', null)
                        .order('start_time', { ascending: false })
                        .limit(1)
                        .single();

                    if (gpsData?.gps_location) {
                        // Parse if string, or use if object. Postgres jsonb returns object.
                        // But in previous turns we saw it might be stringified? 
                        // The store.ts parses it. Let's assume it comes as object from supabase-js if column is jsonb.
                        // If column is text, we parse.
                        // `gps_location` in `time_entries` is likely JSONB based on usage.
                        // Let's try to use it directly, if it fails we might need parsing.
                        // Safe bet: check type.
                        let loc = gpsData.gps_location;
                        if (typeof loc === 'string') {
                            try { loc = JSON.parse(loc); } catch (e) { }
                        }
                        techInfo.location = loc;
                    }
                }
            }
        }

        return new Response(JSON.stringify({
            job: {
                title: jobData.title,
                status: jobData.status,
                start: jobData.start_time,
                end: jobData.end_time,
                location: jobLocation
            },
            tech: techInfo
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
