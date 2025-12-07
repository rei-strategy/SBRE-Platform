import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (req) => {
    const url = new URL(req.url);
    const type = url.searchParams.get("type"); // 'open' or 'click'
    const campaignId = url.searchParams.get("cid");
    const recipientId = url.searchParams.get("rid");

    // Return 1x1 transparent GIF immediately for 'open'
    const transparentGif = new Uint8Array([
        0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xff, 0xff, 0xff,
        0x00, 0x00, 0x00, 0x21, 0xf9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00,
        0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3b
    ]);

    // Async logging (fire and forget)
    if (type && campaignId && recipientId) {
        (async () => {
            try {
                const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

                // 1. Update Email Log
                // We need to find the log entry. Since we don't have the log ID in the pixel (to keep it short),
                // we search by campaign + recipient.
                const { data: logs } = await supabase
                    .from("email_logs")
                    .select("id, opened_at")
                    .eq("campaign_id", campaignId)
                    .eq("recipient_id", recipientId)
                    .limit(1);

                if (logs && logs.length > 0) {
                    const log = logs[0];
                    if (type === 'open' && !log.opened_at) {
                        await supabase.from("email_logs").update({ opened_at: new Date().toISOString(), status: 'OPENED' }).eq("id", log.id);
                        // Increment Campaign Stats
                        await supabase.rpc('increment_open_count', { campaign_id: campaignId });
                    }
                }
            } catch (e) {
                console.error("Tracking Error", e);
            }
        })();
    }

    return new Response(transparentGif, {
        headers: { "Content-Type": "image/gif", "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" },
    });
});
