import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Opaque health probe: returns {status: "ok"} when the database is reachable,
  // 503 otherwise. No infrastructure details, latency, versions, or configuration
  // flags are exposed to callers.
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      console.error("Health check: backend not configured");
      return new Response(JSON.stringify({ status: "error" }), {
        status: 503,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from("projects").select("id").limit(1);

    if (error) {
      console.error("Health check db error:", error);
      return new Response(JSON.stringify({ status: "error" }), {
        status: 503,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Health check error:", error);
    return new Response(JSON.stringify({ status: "error" }), {
      status: 503,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
