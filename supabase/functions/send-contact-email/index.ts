import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const adminEmail = Deno.env.get("ADMIN_EMAIL");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-contact-email function invoked");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, company, message }: ContactEmailRequest = await req.json();
    console.log(`Processing contact email for: ${email}`);

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "Buckeye DataCom <onboarding@resend.dev>",
      to: [email],
      subject: "We received your message - Buckeye DataCom",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #BB0000 0%, #8B0000 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Contacting Us!</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
            
            <p>Thank you for reaching out to Buckeye DataCom! We've received your message and our team will review it promptly.</p>
            
            <p><strong>You can expect a response within 24 hours.</strong></p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #BB0000;">
              <h3 style="margin-top: 0; color: #BB0000;">Your Message Summary:</h3>
              ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
              ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
              <p><strong>Message:</strong></p>
              <p style="color: #666;">${message.substring(0, 200)}${message.length > 200 ? '...' : ''}</p>
            </div>
            
            <p>In the meantime, feel free to explore our services and past projects on our website.</p>
            
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

    console.log("User confirmation email sent:", userEmailResponse);

    // Send notification email to admin
    if (adminEmail) {
      const adminEmailResponse = await resend.emails.send({
        from: "Buckeye DataCom <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `🔔 New Contact Submission from ${name}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #1a1a1a; padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px;">📬 New Contact Form Submission</h1>
            </div>
            
            <div style="background: #f5f5f5; padding: 25px; border-radius: 0 0 10px 10px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd;"><strong>Phone:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${phone || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd;"><strong>Company:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${company || 'Not provided'}</td>
                </tr>
              </table>
              
              <div style="margin-top: 20px; background: white; padding: 15px; border-radius: 8px;">
                <h3 style="margin-top: 0; color: #BB0000;">Message:</h3>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              
              <p style="margin-top: 20px; color: #666; font-size: 12px;">
                Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET
              </p>
            </div>
          </body>
          </html>
        `,
      });

      console.log("Admin notification email sent:", adminEmailResponse);
    } else {
      console.warn("ADMIN_EMAIL not configured, skipping admin notification");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
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
