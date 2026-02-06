import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    // Extract buyer email (buyer for purchases, subscriber for subscription events)
    const buyerEmail = (data.buyer?.email || data.subscriber?.email)?.toLowerCase();
    if (!buyerEmail) {
      console.error("No buyer/subscriber email in webhook payload");
      return new Response(JSON.stringify({ error: "No email found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Determine plan from price
    const price = data.purchase?.price?.value;
    let plan = "mensal";
    if (price) {
      if (price >= 190) plan = "anual";
      else if (price >= 120) plan = "semestral";
    }

    const transactionId = data.purchase?.transaction || null;

    // Create admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
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

    if (!matchedUser) {
      console.log(`No user found with email: ${buyerEmail}. Will be activated on signup.`);
      // Store pending activation - we'll check on login
      // For now just acknowledge
      return new Response(
        JSON.stringify({ status: "pending", message: "User not found yet, will activate on signup" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update profile based on event
    let subscriptionStatus = "pending";
    let subscriptionPlan: string | null = null;
    let subscriptionExpiresAt: string | null = null;

    switch (event) {
      case "PURCHASE_APPROVED":
      case "PURCHASE_COMPLETE":
      case "SUBSCRIPTION_REACTIVATION":
        subscriptionStatus = "active";
        subscriptionPlan = plan;
        // Set expiration based on plan
        const now = new Date();
        if (plan === "anual") {
          now.setFullYear(now.getFullYear() + 1);
        } else if (plan === "semestral") {
          now.setMonth(now.getMonth() + 6);
        } else {
          now.setMonth(now.getMonth() + 1);
        }
        subscriptionExpiresAt = now.toISOString();
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
