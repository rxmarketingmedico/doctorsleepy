import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAdmin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Find existing user
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const existing = users?.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase().trim()
    );

    if (!existing) {
      return new Response(
        JSON.stringify({ success: false, not_found: true, message: "Este email não possui uma conta ativa. Assine um plano para ter acesso." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate new temporary password
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_+=!@#$";
    const array = new Uint8Array(20);
    crypto.getRandomValues(array);
    const newPassword = Array.from(array, (byte) => chars[byte % chars.length]).join("");

    // Update user's password
    const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
      password: newPassword,
    });

    if (updateErr) {
      console.error("Error updating password:", updateErr);
      throw new Error("Failed to reset access");
    }

    // Generate magic link
    const redirectUrl = "https://doctorsleepy.lovable.app/";
    const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: email.toLowerCase().trim(),
      options: { redirectTo: redirectUrl },
    });

    if (linkErr) {
      console.error("Error generating magic link:", linkErr);
    }

    const actionLink = linkData?.properties?.action_link;
    const magicLinkUrl = actionLink
      ? actionLink.replace(/redirect_to=[^&]*/, "redirect_to=" + encodeURIComponent(redirectUrl))
      : "https://doctorsleepy.lovable.app/auth";

    // Send email
    const safePassword = newPassword
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

    const firstName =
      existing.user_metadata?.full_name?.split(" ")[0] ||
      existing.user_metadata?.name?.split(" ")[0] ||
      "there";

    const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

    await resend.emails.send({
      from: "Dr. Sleepy <noreply@doutorsoneca.com>",
      to: [email.toLowerCase().trim()],
      subject: "🌙 Seu acesso ao Dr. Sleepy",
      html: `
        <!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin:0;padding:0;background-color:#f8f4ff;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
          <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
            <div style="background:white;border-radius:16px;padding:40px;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
              <div style="text-align:center;margin-bottom:30px;">
                <div style="font-size:48px;margin-bottom:10px;">🌙</div>
                <h1 style="color:#6c3fa0;font-size:24px;margin:0;">Dr. Sleepy</h1>
                <p style="color:#888;font-size:14px;">Seu acesso foi reenviado!</p>
              </div>
              <p style="color:#333;font-size:16px;line-height:1.6;">Olá, <strong>${firstName}</strong>! 👋</p>
              <p style="color:#333;font-size:16px;line-height:1.6;">Você solicitou um novo acesso ao Dr. Sleepy. Clique no botão abaixo para entrar diretamente:</p>
              <div style="text-align:center;margin:30px 0;">
                <a href="${magicLinkUrl}" style="display:inline-block;background:linear-gradient(135deg,#6c3fa0,#9b59b6);color:white;text-decoration:none;padding:16px 40px;border-radius:12px;font-size:18px;font-weight:bold;box-shadow:0 4px 15px rgba(108,63,160,0.3);">Acessar Dr. Sleepy →</a>
              </div>
              <div style="background:#f8f4ff;border-radius:12px;padding:20px;margin:25px 0;">
                <p style="color:#6c3fa0;font-size:14px;font-weight:bold;margin:0 0 12px 0;">🔐 Seus dados de acesso:</p>
                <table style="width:100%;border-collapse:collapse;">
                  <tr><td style="color:#666;font-size:14px;padding:4px 0;">Email:</td><td style="color:#333;font-size:14px;font-weight:bold;padding:4px 0;">${email}</td></tr>
                  <tr><td style="color:#666;font-size:14px;padding:4px 0;">Senha temporária:</td><td style="color:#333;font-size:14px;font-weight:bold;padding:4px 0;">${safePassword}</td></tr>
                </table>
                <p style="color:#888;font-size:12px;margin:10px 0 0 0;">⚠️ Recomendamos trocar sua senha após o primeiro acesso, no menu Perfil.</p>
              </div>
              <p style="color:#888;font-size:13px;text-align:center;line-height:1.5;">O link de acesso rápido expira em 24 horas.</p>
              <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">
              <p style="color:#888;font-size:12px;text-align:center;">Dr. Sleepy — Noites tranquilas para toda a família 🌙</p>
            </div>
          </div>
        </body></html>
      `,
    });

    return new Response(
      JSON.stringify({ success: true, message: "Access instructions sent to email." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("resend-access error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
