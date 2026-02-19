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
      console.error("Invalid hottok received:", receivedToken);
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

    // Extract buyer email — covers buyer, subscriber, switch_plan (SWITCH_PLAN uses subscription.user.email)
    const buyerEmail = (
      data.buyer?.email ||
      data.subscriber?.email ||
      data.purchase?.buyer?.email ||
      data.switch_plan?.subscriber?.email ||
      data.subscription?.user?.email
    )?.toLowerCase();

    if (!buyerEmail) {
      console.error("No buyer/subscriber email in webhook payload", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "No email found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const buyerName =
      data.buyer?.name ||
      data.subscriber?.name ||
      data.purchase?.buyer?.name ||
      data.switch_plan?.subscriber?.name ||
      data.subscription?.user?.name ||
      "";
    const buyerPhone = data.buyer?.checkout_phone || data.buyer?.phone || null;

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

    // Find user by email — paginate to avoid the 1000-user limit
    const matchedUser = await findUserByEmail(supabaseAdmin, buyerEmail);

    // Handle purchase events — create user if not found
    const isPurchaseEvent = [
      "PURCHASE_APPROVED",
      "PURCHASE_COMPLETE",
      "SUBSCRIPTION_REACTIVATION",
      "SUBSCRIPTION_RENEWAL_CHARGE",
      "SWITCH_PLAN",
    ].includes(event);

    if (!matchedUser && isPurchaseEvent) {
      console.log(`No user found for ${buyerEmail}. Creating account automatically...`);

      const defaultPassword = generateSecurePassword();

      const { data: newUserData, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email: buyerEmail,
          password: defaultPassword,
          email_confirm: true,
          user_metadata: { full_name: buyerName },
        });

      if (createError) {
        console.error("Error creating user:", createError);
        await savePendingActivation(supabaseAdmin, buyerEmail, event, plan, transactionId, body);
        return new Response(
          JSON.stringify({ status: "pending", message: "User creation failed, saved for later" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const newUserId = newUserData.user.id;
      console.log(`User created: ${newUserId}`);

      const expiresAt = calculateExpiration(plan, event);

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
          buyer_phone: buyerPhone,
        })
        .eq("user_id", newUserId);

      if (updateError) {
        console.error("Error updating new user profile:", updateError);
      }

      // Generate magic link and send welcome email
      const { data: linkData, error: linkError } =
        await supabaseAdmin.auth.admin.generateLink({
          type: "magiclink",
          email: buyerEmail,
          options: {
            redirectTo: "https://doctorsleepy.lovable.app",
          },
        });

      if (linkError) {
        console.error("Error generating magic link:", linkError);
      } else {
        const actionLink = linkData.properties?.action_link;
        const magicLinkUrl = actionLink
          ? actionLink.replace(/redirect_to=[^&]*/, 'redirect_to=' + encodeURIComponent('https://doctorsleepy.lovable.app'))
          : `${supabaseUrl}/auth/v1/verify?token_hash=${linkData.properties?.hashed_token}&type=magiclink&redirect_to=${encodeURIComponent('https://doctorsleepy.lovable.app')}`;

        await sendWelcomeEmail(buyerEmail, buyerName, magicLinkUrl, defaultPassword);
        await sendAdminNotificationEmail(buyerEmail, buyerName, plan, event, true);
      }

      return new Response(
        JSON.stringify({ status: "ok", message: "User created and welcome email sent", subscription_status: "active" }),
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
    let sendRenewalEmail = false;

    switch (event) {
      case "PURCHASE_APPROVED":
      case "PURCHASE_COMPLETE":
      case "SUBSCRIPTION_REACTIVATION":
      case "SWITCH_PLAN":
        subscriptionStatus = "active";
        subscriptionPlan = plan;
        subscriptionExpiresAt = calculateExpiration(plan, event);
        break;

      // ✅ Renewal: extend the subscription period
      case "SUBSCRIPTION_RENEWAL_CHARGE":
        subscriptionStatus = "active";
        subscriptionPlan = plan;
        subscriptionExpiresAt = calculateExpiration(plan, event);
        sendRenewalEmail = true;
        console.log(`Subscription renewal for ${buyerEmail} — new expiry: ${subscriptionExpiresAt}`);
        break;

      // ❌ Cancellations
      case "PURCHASE_REFUNDED":
      case "PURCHASE_CHARGEBACK":
      case "SUBSCRIPTION_CANCELLATION":
      case "PURCHASE_CANCELED":
        subscriptionStatus = "cancelled";
        subscriptionPlan = null;
        subscriptionExpiresAt = null;
        break;

      // ⏳ Pending / failed payments
      case "PURCHASE_DELAYED":
      case "PURCHASE_PROTEST":
      case "PURCHASE_EXPIRED":
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
        buyer_phone: buyerPhone,
      })
      .eq("user_id", matchedUser.id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return new Response(JSON.stringify({ error: "Failed to update profile" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send renewal confirmation email
    if (sendRenewalEmail) {
      await sendRenewalConfirmationEmail(buyerEmail, buyerName, subscriptionExpiresAt!);
    }

    // Send admin notification for all purchase/activation events
    if (["PURCHASE_APPROVED", "PURCHASE_COMPLETE", "SUBSCRIPTION_REACTIVATION", "SWITCH_PLAN", "SUBSCRIPTION_RENEWAL_CHARGE"].includes(event)) {
      await sendAdminNotificationEmail(buyerEmail, buyerName, subscriptionPlan || plan, event, false);
    }

    console.log(`Profile updated for ${buyerEmail}: ${subscriptionStatus} (${subscriptionPlan}) expires: ${subscriptionExpiresAt}`);

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

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Paginate through all users to find by email (avoids 1000-user limit) */
async function findUserByEmail(supabaseAdmin: ReturnType<typeof createClient>, email: string) {
  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      console.error("Error listing users:", error);
      return null;
    }

    const match = users.users.find((u) => u.email?.toLowerCase() === email);
    if (match) return match;

    // If fewer users were returned than requested, we've reached the end
    if (users.users.length < perPage) break;
    page++;
  }

  return null;
}

function generateSecurePassword(length = 20): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_+=!@#$';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => chars[byte % chars.length]).join('');
}

/** Calculate expiration. For renewals, add from NOW regardless of current expiry. */
function calculateExpiration(plan: string, event?: string): string {
  const now = new Date();
  if (plan === "anual") now.setFullYear(now.getFullYear() + 1);
  else if (plan === "semestral") now.setMonth(now.getMonth() + 6);
  else now.setMonth(now.getMonth() + 1);
  return now.toISOString();
}

async function savePendingActivation(
  supabaseAdmin: ReturnType<typeof createClient>,
  email: string,
  event: string,
  plan: string,
  transactionId: string | null,
  rawPayload: unknown
) {
  const isPurchase = [
    "PURCHASE_APPROVED",
    "PURCHASE_COMPLETE",
    "SUBSCRIPTION_REACTIVATION",
    "SUBSCRIPTION_RENEWAL_CHARGE",
  ].includes(event);

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

async function sendWelcomeEmail(email: string, name: string, magicLinkUrl: string, password: string) {
  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return;
    }

    const resend = new Resend(resendApiKey);
    const firstName = name ? name.split(" ")[0] : "there";
    const safePassword = password
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    const { error } = await resend.emails.send({
      from: "Dr. Sleepy <noreply@doutorsoneca.com>",
      to: [email],
      subject: "🌙 Your Dr. Sleepy access is ready!",
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
                <img src="https://ytucoisaanzxgnjkfggg.supabase.co/storage/v1/object/public/email-assets/logo-dr-sleepy.png" alt="Dr. Sleepy" style="height:80px;width:auto;margin-bottom:8px;" />
              </div>
              
              <p style="color:#333;font-size:16px;line-height:1.6;">
                Hi, <strong>${firstName}</strong>! 👋
              </p>
              
              <p style="color:#333;font-size:16px;line-height:1.6;">
                Your purchase has been confirmed and your account is ready! 🎉
              </p>
              
              <p style="color:#333;font-size:16px;line-height:1.6;">
                Click the button below to access Dr. Sleepy right now:
              </p>
              
              <div style="text-align:center;margin:30px 0;">
                <a href="${magicLinkUrl}" style="display:inline-block;background:linear-gradient(135deg,#6c3fa0,#9b59b6);color:white;text-decoration:none;padding:16px 40px;border-radius:12px;font-size:18px;font-weight:bold;box-shadow:0 4px 15px rgba(108,63,160,0.3);">
                  Access Dr. Sleepy →
                </a>
              </div>

              <div style="background:#f8f4ff;border-radius:12px;padding:20px;margin:25px 0;">
                <p style="color:#6c3fa0;font-size:14px;font-weight:bold;margin:0 0 12px 0;">🔐 Your login credentials:</p>
                <table style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td style="color:#666;font-size:14px;padding:4px 0;">Email:</td>
                    <td style="color:#333;font-size:14px;font-weight:bold;padding:4px 0;">${email}</td>
                  </tr>
                  <tr>
                    <td style="color:#666;font-size:14px;padding:4px 0;">Temporary password:</td>
                    <td style="color:#333;font-size:14px;font-weight:bold;padding:4px 0;">${safePassword}</td>
                  </tr>
                </table>
                <p style="color:#888;font-size:12px;margin:10px 0 0 0;">
                  ⚠️ We recommend changing your password after your first login, in the Profile menu.
                </p>
              </div>

              <div style="background:#fff3cd;border-radius:12px;padding:16px;margin:20px 0;border:1px solid #ffc107;">
                <p style="color:#856404;font-size:13px;font-weight:bold;margin:0 0 8px 0;">⚠️ Having trouble accessing?</p>
                <p style="color:#856404;font-size:13px;line-height:1.5;margin:0;">
                  If the button above or the temporary password don't work, use the <strong>"Forgot my password"</strong> option on the login screen to create a new password.
                </p>
                <div style="text-align:center;margin-top:12px;">
                  <a href="https://doctorsleepy.lovable.app/auth" style="display:inline-block;background:#6c3fa0;color:white;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:bold;">
                    Go to Login
                  </a>
                </div>
              </div>
              
              <p style="color:#888;font-size:13px;text-align:center;line-height:1.5;">
                The quick-access link expires in 24 hours.
              </p>
              
              <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">
              
              <p style="color:#888;font-size:12px;text-align:center;">
                Dr. Sleepy — Peaceful nights for the whole family 🌙
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending welcome email:", error);
    } else {
      console.log(`Welcome email sent to ${email}`);
    }
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}

async function sendRenewalConfirmationEmail(email: string, name: string, expiresAt: string) {
  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) return;

    const resend = new Resend(resendApiKey);
    const firstName = name ? name.split(" ")[0] : "there";
    const expiryDate = new Date(expiresAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const { error } = await resend.emails.send({
      from: "Dr. Sleepy <noreply@doutorsoneca.com>",
      to: [email],
      subject: "🌙 Your Dr. Sleepy subscription has been renewed!",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin:0;padding:0;background-color:#f8f4ff;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
          <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
            <div style="background:white;border-radius:16px;padding:40px;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
              <div style="text-align:center;margin-bottom:30px;">
                <img src="https://ytucoisaanzxgnjkfggg.supabase.co/storage/v1/object/public/email-assets/logo-dr-sleepy.png" alt="Dr. Sleepy" style="height:80px;width:auto;margin-bottom:8px;" />
              </div>
              
              <p style="color:#333;font-size:16px;line-height:1.6;">Hi, <strong>${firstName}</strong>! 👋</p>
              
              <p style="color:#333;font-size:16px;line-height:1.6;">
                Your subscription has been renewed successfully! ✅
              </p>

              <div style="background:#f0fdf4;border-radius:12px;padding:20px;margin:25px 0;border:1px solid #86efac;">
                <p style="color:#16a34a;font-size:16px;font-weight:bold;margin:0 0 8px 0;">✅ Renewal confirmed</p>
                <p style="color:#333;font-size:14px;margin:0;">
                  Your access is guaranteed until: <strong>${expiryDate}</strong>
                </p>
              </div>
              
              <div style="text-align:center;margin:30px 0;">
                <a href="https://doctorsleepy.lovable.app" style="display:inline-block;background:linear-gradient(135deg,#6c3fa0,#9b59b6);color:white;text-decoration:none;padding:16px 40px;border-radius:12px;font-size:18px;font-weight:bold;">
                  Open Dr. Sleepy →
                </a>
              </div>
              
              <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">
              <p style="color:#888;font-size:12px;text-align:center;">Dr. Sleepy — Peaceful nights for the whole family 🌙</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending renewal email:", error);
    } else {
      console.log(`Renewal email sent to ${email}`);
    }
  } catch (err) {
    console.error("Failed to send renewal email:", err);
  }
}

async function sendAdminNotificationEmail(
  buyerEmail: string,
  buyerName: string,
  plan: string,
  event: string,
  isNewUser: boolean
) {
  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) return;

    const resend = new Resend(resendApiKey);

    const eventLabels: Record<string, string> = {
      PURCHASE_APPROVED: "✅ Nova Compra",
      PURCHASE_COMPLETE: "✅ Compra Concluída",
      SUBSCRIPTION_REACTIVATION: "🔄 Reativação",
      SWITCH_PLAN: "🔀 Troca de Plano",
      SUBSCRIPTION_RENEWAL_CHARGE: "🔁 Renovação",
    };

    const planLabels: Record<string, string> = {
      mensal: "Mensal",
      semestral: "Semestral",
      anual: "Anual",
    };

    const eventLabel = eventLabels[event] || event;
    const planLabel = planLabels[plan] || plan;
    const userStatus = isNewUser ? "🆕 Novo usuário criado" : "👤 Usuário existente atualizado";

    await resend.emails.send({
      from: "Dr. Sleepy <noreply@doutorsoneca.com>",
      to: ["agenciadbsdigital@gmail.com"],
      subject: `${eventLabel} — ${buyerName || buyerEmail}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin:0;padding:0;background:#f8f4ff;font-family:'Segoe UI',sans-serif;">
          <div style="max-width:500px;margin:0 auto;padding:30px 20px;">
            <div style="background:white;border-radius:12px;padding:30px;box-shadow:0 4px 15px rgba(0,0,0,0.08);">
              <div style="text-align:center;margin-bottom:20px;">
                <img src="https://ytucoisaanzxgnjkfggg.supabase.co/storage/v1/object/public/email-assets/logo-dr-sleepy.png" alt="Dr. Sleepy" style="height:60px;width:auto;" />
              </div>
              <h2 style="color:#6c3fa0;font-size:20px;margin:0 0 20px 0;text-align:center;">${eventLabel}</h2>
              <table style="width:100%;border-collapse:collapse;">
                <tr style="border-bottom:1px solid #f0f0f0;">
                  <td style="color:#888;font-size:14px;padding:10px 0;">Nome</td>
                  <td style="color:#333;font-size:14px;font-weight:bold;padding:10px 0;">${buyerName || "—"}</td>
                </tr>
                <tr style="border-bottom:1px solid #f0f0f0;">
                  <td style="color:#888;font-size:14px;padding:10px 0;">Email</td>
                  <td style="color:#333;font-size:14px;padding:10px 0;">${buyerEmail}</td>
                </tr>
                <tr style="border-bottom:1px solid #f0f0f0;">
                  <td style="color:#888;font-size:14px;padding:10px 0;">Plano</td>
                  <td style="color:#333;font-size:14px;font-weight:bold;padding:10px 0;">${planLabel}</td>
                </tr>
                <tr>
                  <td style="color:#888;font-size:14px;padding:10px 0;">Status</td>
                  <td style="color:#333;font-size:14px;padding:10px 0;">${userStatus}</td>
                </tr>
              </table>
              <div style="text-align:center;margin-top:25px;">
                <a href="https://doctorsleepy.lovable.app/admin" style="display:inline-block;background:#6c3fa0;color:white;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:bold;">
                  Ver no Painel Admin →
                </a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`Admin notification sent for ${buyerEmail} — ${event}`);
  } catch (err) {
    console.error("Failed to send admin notification email:", err);
  }
}
