import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const adminEmail = Deno.env.get("ADMIN_EMAIL");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuoteEmailRequest {
  name?: string;
  email?: string;
  phone?: string;
  projectType?: string;
  projectSize: number;
  estimatedPrice: number;
  fileName?: string;
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-quote-email function invoked");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, projectType, projectSize, estimatedPrice, fileName, notes }: QuoteEmailRequest = await req.json();
    console.log(`Processing quote email for: ${email || 'anonymous'}, estimate: $${estimatedPrice}`);

    // Send confirmation email to user (if email provided)
    if (email) {
      const userEmailResponse = await resend.emails.send({
        from: "Buckeye DataCom <onboarding@resend.dev>",
        to: [email],
        subject: "Your Fiber Optic Quote Estimate - Buckeye DataCom",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #BB0000 0%, #8B0000 100%); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Your Quote Estimate</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px;">Hi${name ? ` <strong>${name}</strong>` : ''},</p>
              
              <p>Thank you for requesting a quote from Buckeye DataCom! Here's your preliminary estimate:</p>
              
              <div style="background: linear-gradient(135deg, #BB0000 0%, #8B0000 100%); padding: 25px; border-radius: 10px; text-align: center; margin: 25px 0;">
                <p style="color: rgba(255,255,255,0.9); margin: 0 0 10px 0; font-size: 14px;">ESTIMATED COST</p>
                <p style="color: white; font-size: 42px; font-weight: bold; margin: 0;">$${estimatedPrice.toLocaleString()}</p>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #BB0000;">Project Details:</h3>
                ${projectType ? `<p><strong>Project Type:</strong> ${projectType}</p>` : ''}
                <p><strong>Project Size:</strong> ${projectSize.toLocaleString()} sq ft</p>
                ${fileName ? `<p><strong>Floor Plan:</strong> ${fileName}</p>` : ''}
                ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
              </div>
              
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px; margin: 20px 0;">
                <p style="margin: 0; color: #856404;"><strong>Important:</strong> This is a preliminary estimate based on project size. Final pricing will be provided after our team reviews your requirements in detail.</p>
              </div>
              
              <h3 style="color: #BB0000;">What's Next?</h3>
              <ol>
                <li>Our team will review your request within 24 hours</li>
                <li>We'll contact you to discuss your specific requirements</li>
                <li>You'll receive a detailed proposal with final pricing</li>
              </ol>
              
              <p style="margin-top: 30px;">
                Best regards,<br>
                <strong>The Buckeye DataCom Team</strong>
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #888; font-size: 12px;">
              <p>© ${new Date().getFullYear()} Buckeye DataCom. All rights reserved.</p>
            </div>
          </body>
          </html>
        `,
      });

      console.log("User quote confirmation email sent:", userEmailResponse);
    }

    // Send notification email to admin
    if (adminEmail) {
      const adminEmailResponse = await resend.emails.send({
        from: "Buckeye DataCom <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `💰 New Quote Request - $${estimatedPrice.toLocaleString()}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #28a745 0%, #218838 100%); padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px;">💰 New Quote Request</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 28px; font-weight: bold;">$${estimatedPrice.toLocaleString()}</p>
            </div>
            
            <div style="background: #f5f5f5; padding: 25px; border-radius: 0 0 10px 10px;">
              <h3 style="margin-top: 0; color: #333;">Contact Information</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${name || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${email ? `<a href="mailto:${email}">${email}</a>` : 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Phone:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${phone || 'Not provided'}</td>
                </tr>
              </table>
              
              <h3 style="color: #333;">Project Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Project Type:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${projectType || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Project Size:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${projectSize.toLocaleString()} sq ft</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Estimated Price:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd; color: #28a745; font-weight: bold;">$${estimatedPrice.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Floor Plan:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${fileName || 'None uploaded'}</td>
                </tr>
              </table>
              
              ${notes ? `
              <div style="margin-top: 20px; background: white; padding: 15px; border-radius: 8px;">
                <h4 style="margin-top: 0; color: #666;">Additional Notes:</h4>
                <p style="margin-bottom: 0;">${notes}</p>
              </div>
              ` : ''}
              
              <p style="margin-top: 20px; color: #666; font-size: 12px;">
                Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET
              </p>
            </div>
          </body>
          </html>
        `,
      });

      console.log("Admin quote notification email sent:", adminEmailResponse);
    } else {
      console.warn("ADMIN_EMAIL not configured, skipping admin notification");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-quote-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
