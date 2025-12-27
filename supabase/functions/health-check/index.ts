import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  services: {
    database: { status: string; latency?: number };
    email: { status: string; configured: boolean };
  };
  uptime: number;
}

const startTime = Date.now();

const handler = async (req: Request): Promise<Response> => {
  console.log("Health check invoked");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const healthStatus: HealthStatus = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    services: {
      database: { status: "unknown" },
      email: { status: "unknown", configured: false },
    },
    uptime: Math.floor((Date.now() - startTime) / 1000),
  };

  try {
    // Check database connectivity
    const dbStartTime = Date.now();
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Simple query to verify database connection
      const { error } = await supabase
        .from("projects")
        .select("id")
        .limit(1);
      
      const dbLatency = Date.now() - dbStartTime;
      
      if (error) {
        console.error("Database check failed:", error);
        healthStatus.services.database = { 
          status: "error", 
          latency: dbLatency 
        };
        healthStatus.status = "degraded";
      } else {
        healthStatus.services.database = { 
          status: "connected", 
          latency: dbLatency 
        };
      }
    } else {
      healthStatus.services.database = { status: "not_configured" };
      healthStatus.status = "degraded";
    }

    // Check email service configuration
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const adminEmail = Deno.env.get("ADMIN_EMAIL");
    
    healthStatus.services.email = {
      status: resendApiKey ? "configured" : "not_configured",
      configured: !!(resendApiKey && adminEmail),
    };

    if (!resendApiKey) {
      healthStatus.status = healthStatus.status === "healthy" ? "degraded" : healthStatus.status;
    }

    // Determine overall status
    const allServicesHealthy = 
      healthStatus.services.database.status === "connected" &&
      healthStatus.services.email.configured;
    
    if (!allServicesHealthy && healthStatus.status === "healthy") {
      healthStatus.status = "degraded";
    }

    console.log("Health check completed:", healthStatus.status);

    return new Response(JSON.stringify(healthStatus), {
      status: healthStatus.status === "unhealthy" ? 503 : 200,
      headers: { 
        "Content-Type": "application/json", 
        "Cache-Control": "no-cache, no-store, must-revalidate",
        ...corsHeaders 
      },
    });
  } catch (error: any) {
    console.error("Health check error:", error);
    
    healthStatus.status = "unhealthy";
    healthStatus.services.database = { status: "error" };
    
    return new Response(JSON.stringify(healthStatus), {
      status: 503,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
