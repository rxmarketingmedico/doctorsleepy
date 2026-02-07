import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-hotmart-hottok",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const hottok = Deno.env.get("HOTMART_HOTTOK");
    if (!hottok) {
      console.error("HOTMART_HOTTOK not configured");
      return new Response(JSON.stringify({ error: "Server misconfigured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate Hotmart token
    const receivedToken = req.headers.get("x-hotmart-hottok");
    if (receivedToken !== hottok) {
      console.error("Invalid hottok received");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    console.log("Hotmart webhook received:", JSON.stringify(body));

    const event = body.event;
    const data = body.data;

    if (!event || !data) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract buyer email
    const buyerEmail = (data.buyer?.email || data.subscriber?.email)?.toLowerCase();
    if (!buyerEmail) {
      console.error("No buyer/subscriber email in webhook payload");
      return new Response(JSON.stringify({ error: "No email found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const buyerName = data.buyer?.name || data.subscriber?.name || "";

    // Determine plan from price
    const price = data.purchase?.price?.value;
    let plan = "mensal";
    if (price) {
      if (price >= 190) plan = "anual";
      else if (price >= 120) plan = "semestral";
    }

    const transactionId = data.purchase?.transaction || null;

    // Create admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAdmin = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find user by email
    const { data: users, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      console.error("Error listing users:", listError);
      return new Response(JSON.stringify({ error: "Internal error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const matchedUser = users.users.find(
      (u) => u.email?.toLowerCase() === buyerEmail
    );

    // Handle purchase events — create user if not found
    const isPurchaseEvent = [
      "PURCHASE_APPROVED",
      "PURCHASE_COMPLETE",
      "SUBSCRIPTION_REACTIVATION",
    ].includes(event);

    if (!matchedUser && isPurchaseEvent) {
      console.log(`No user found for ${buyerEmail}. Creating account automatically...`);

      // Generate a random password (user will use magic link, never this password)
      const randomPassword = crypto.randomUUID() + "Aa1!";

      // Create user via admin API
      const { data: newUserData, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email: buyerEmail,
          password: randomPassword,
          email_confirm: true, // auto-confirm email
          user_metadata: { full_name: buyerName },
        });

      if (createError) {
        console.error("Error creating user:", createError);
        // Save as pending activation as fallback
        await savePendingActivation(supabaseAdmin, buyerEmail, event, plan, transactionId, body);
        return new Response(
          JSON.stringify({ status: "pending", message: "User creation failed, saved for later" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const newUserId = newUserData.user.id;
      console.log(`User created: ${newUserId}`);

      // Calculate expiration
      const expiresAt = calculateExpiration(plan);

      // Update the profile (created by trigger) with subscription data
      // Small delay to allow the trigger to create the profile
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          subscription_status: "active",
          subscription_plan: plan,
          subscription_expires_at: expiresAt,
          hotmart_transaction_id: transactionId,
          subscription_id: transactionId,
          parent_name: buyerName || null,
        })
        .eq("user_id", newUserId);

      if (updateError) {
        console.error("Error updating new user profile:", updateError);
      }

      // Generate magic link and send email via Resend
      const { data: linkData, error: linkError } =
        await supabaseAdmin.auth.admin.generateLink({
          type: "magiclink",
          email: buyerEmail,
          options: {
            redirectTo: `${supabaseUrl.replace('.supabase.co', '')}.supabase.co/auth/v1/verify`,
          },
        });

      if (linkError) {
        console.error("Error generating magic link:", linkError);
      } else {
        // Build the verification URL
        const tokenHash = linkData.properties?.hashed_token;
        const magicLinkUrl = `${supabaseUrl}/auth/v1/verify?token=${tokenHash}&type=magiclink&redirect_to=https://doutorsoneca.lovable.app`;

        // Send email via Resend
        await sendMagicLinkEmail(buyerEmail, buyerName, magicLinkUrl);
      }

      return new Response(
        JSON.stringify({ status: "ok", message: "User created and magic link sent", subscription_status: "active" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!matchedUser) {
      console.log(`No user found with email: ${buyerEmail}. Saving pending activation.`);
      await savePendingActivation(supabaseAdmin, buyerEmail, event, plan, transactionId, body);
      return new Response(
        JSON.stringify({ status: "pending", message: "Saved for activation on signup" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Existing user — update profile based on event
    let subscriptionStatus = "pending";
    let subscriptionPlan: string | null = null;
    let subscriptionExpiresAt: string | null = null;

    switch (event) {
      case "PURCHASE_APPROVED":
      case "PURCHASE_COMPLETE":
      case "SUBSCRIPTION_REACTIVATION":
        subscriptionStatus = "active";
        subscriptionPlan = plan;
        subscriptionExpiresAt = calculateExpiration(plan);
        break;

      case "PURCHASE_REFUNDED":
      case "PURCHASE_CHARGEBACK":
      case "SUBSCRIPTION_CANCELLATION":
      case "PURCHASE_CANCELED":
        subscriptionStatus = "cancelled";
        break;

      case "PURCHASE_DELAYED":
      case "PURCHASE_PROTEST":
        subscriptionStatus = "pending";
        break;

      default:
        console.log(`Unhandled event: ${event}`);
    }

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        subscription_status: subscriptionStatus,
        subscription_plan: subscriptionPlan,
        subscription_expires_at: subscriptionExpiresAt,
        hotmart_transaction_id: transactionId,
        subscription_id: transactionId,
      })
      .eq("user_id", matchedUser.id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return new Response(JSON.stringify({ error: "Failed to update profile" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Profile updated for ${buyerEmail}: ${subscriptionStatus} (${subscriptionPlan})`);

    return new Response(
      JSON.stringify({ status: "ok", subscription_status: subscriptionStatus }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function calculateExpiration(plan: string): string {
  const now = new Date();
  if (plan === "anual") now.setFullYear(now.getFullYear() + 1);
  else if (plan === "semestral") now.setMonth(now.getMonth() + 6);
  else now.setMonth(now.getMonth() + 1);
  return now.toISOString();
}

async function savePendingActivation(
  supabaseAdmin: any,
  email: string,
  event: string,
  plan: string,
  transactionId: string | null,
  rawPayload: any
) {
  const isPurchase = ["PURCHASE_APPROVED", "PURCHASE_COMPLETE", "SUBSCRIPTION_REACTIVATION"].includes(event);

  const { error } = await supabaseAdmin.from("pending_activations").insert({
    email,
    subscription_status: isPurchase ? "active" : "pending",
    subscription_plan: isPurchase ? plan : null,
    subscription_expires_at: isPurchase ? calculateExpiration(plan) : null,
    hotmart_transaction_id: transactionId,
    event,
    raw_payload: rawPayload,
  });

  if (error) {
    console.error("Error saving pending activation:", error);
  }
}

async function sendMagicLinkEmail(email: string, name: string, magicLinkUrl: string) {
  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return;
    }

    const resend = new Resend(resendApiKey);
    const firstName = name ? name.split(" ")[0] : "mamãe/papai";

    const { error } = await resend.emails.send({
      from: "Doutor Soneca <noreply@doutorsoneca.com>",
      to: [email],
      subject: "🌙 Seu acesso ao Doutor Soneca está pronto!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background-color:#f8f4ff;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
          <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
            <div style="background:white;border-radius:16px;padding:40px;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
              <div style="text-align:center;margin-bottom:30px;">
                <div style="font-size:48px;margin-bottom:10px;">🌙</div>
                <h1 style="color:#6c3fa0;font-size:24px;margin:0;">Doutor Soneca</h1>
              </div>
              
              <p style="color:#333;font-size:16px;line-height:1.6;">
                Olá, <strong>${firstName}</strong>! 👋
              </p>
              
              <p style="color:#333;font-size:16px;line-height:1.6;">
                Sua compra foi confirmada e sua conta já está pronta! 🎉
              </p>
              
              <p style="color:#333;font-size:16px;line-height:1.6;">
                Clique no botão abaixo para acessar o Doutor Soneca e começar a transformar as noites do seu bebê:
              </p>
              
              <div style="text-align:center;margin:30px 0;">
                <a href="${magicLinkUrl}" style="display:inline-block;background:linear-gradient(135deg,#6c3fa0,#9b59b6);color:white;text-decoration:none;padding:16px 40px;border-radius:12px;font-size:18px;font-weight:bold;box-shadow:0 4px 15px rgba(108,63,160,0.3);">
                  Acessar Doutor Soneca →
                </a>
              </div>
              
              <p style="color:#888;font-size:13px;text-align:center;line-height:1.5;">
                Este link expira em 24 horas. Se expirar, basta fazer login com seu email na página de acesso.
              </p>
              
              <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">
              
              <p style="color:#888;font-size:12px;text-align:center;">
                Doutor Soneca — Noites tranquilas para toda a família 🌙
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending magic link email:", error);
    } else {
      console.log(`Magic link email sent to ${email}`);
    }
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}
