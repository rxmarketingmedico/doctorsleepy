import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name } = await req.json();
    const testEmail = `teste-${Date.now()}@doutorsoneca.com`;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAdmin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Generate password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_+=!@#$';
    const array = new Uint8Array(20);
    crypto.getRandomValues(array);
    const password = Array.from(array, byte => chars[byte % chars.length]).join('');

    // Create user with the TARGET email (so magic link works for them)
    // First check/delete existing
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const existing = users?.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    if (existing) {
      await supabaseAdmin.auth.admin.deleteUser(existing.id);
      await new Promise(r => setTimeout(r, 1000));
    }

    const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name || "Teste" },
    });
    if (createErr) {
      return new Response(JSON.stringify({ error: createErr }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate magic link
    const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: "https://doutorsoneca.lovable.app" },
    });

    const actionLink = linkData?.properties?.action_link;
    const magicLinkUrl = actionLink
      ? actionLink.replace(/redirect_to=[^&]*/, 'redirect_to=' + encodeURIComponent('https://doutorsoneca.lovable.app'))
      : "https://doutorsoneca.lovable.app/auth";

    // Send email
    const safePassword = password.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const firstName = name ? name.split(" ")[0] : "there";
    const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

    await resend.emails.send({
      from: "Dr. Sleepy <noreply@doutorsoneca.com>",
      to: [email],
      subject: "🌙 [REAL TEST] Access Dr. Sleepy - Magic Link + Password",
      html: `
        <!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin:0;padding:0;background-color:#f8f4ff;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
          <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
            <div style="background:white;border-radius:16px;padding:40px;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
              <div style="text-align:center;margin-bottom:30px;">
                <div style="font-size:48px;margin-bottom:10px;">🌙</div>
                <h1 style="color:#6c3fa0;font-size:24px;margin:0;">Dr. Sleepy</h1>
                <p style="color:#e74c3c;font-size:12px;font-weight:bold;">⚡ REAL TEST - CLICK THE MAGIC LINK AND TEST THE PASSWORD</p>
              </div>
              <p style="color:#333;font-size:16px;line-height:1.6;">Hi, <strong>${firstName}</strong>! 👋</p>
              <p style="color:#333;font-size:16px;line-height:1.6;">Your purchase has been confirmed and your account is ready! 🎉</p>
              <p style="color:#333;font-size:16px;line-height:1.6;">Click the button below to access Dr. Sleepy right now:</p>
              <div style="text-align:center;margin:30px 0;">
                <a href="${magicLinkUrl}" style="display:inline-block;background:linear-gradient(135deg,#6c3fa0,#9b59b6);color:white;text-decoration:none;padding:16px 40px;border-radius:12px;font-size:18px;font-weight:bold;box-shadow:0 4px 15px rgba(108,63,160,0.3);">Access Dr. Sleepy →</a>
              </div>
              <div style="background:#f8f4ff;border-radius:12px;padding:20px;margin:25px 0;">
                <p style="color:#6c3fa0;font-size:14px;font-weight:bold;margin:0 0 12px 0;">🔐 Your login credentials:</p>
                <table style="width:100%;border-collapse:collapse;">
                  <tr><td style="color:#666;font-size:14px;padding:4px 0;">Email:</td><td style="color:#333;font-size:14px;font-weight:bold;padding:4px 0;">${email}</td></tr>
                  <tr><td style="color:#666;font-size:14px;padding:4px 0;">Temporary password:</td><td style="color:#333;font-size:14px;font-weight:bold;padding:4px 0;">${safePassword}</td></tr>
                </table>
                <p style="color:#888;font-size:12px;margin:10px 0 0 0;">⚠️ We recommend changing your password after your first login, in the Profile menu.</p>
              </div>
              <div style="background:#fff3cd;border-radius:12px;padding:16px;margin:20px 0;border:1px solid #ffc107;">
                <p style="color:#856404;font-size:13px;font-weight:bold;margin:0 0 8px 0;">⚠️ Having trouble accessing?</p>
                <p style="color:#856404;font-size:13px;line-height:1.5;margin:0;">If the button above or the temporary password don't work, use the <strong>"Forgot my password"</strong> option on the login screen to create a new password.</p>
                <div style="text-align:center;margin-top:12px;">
                  <a href="https://doctorsleepy.lovable.app/auth" style="display:inline-block;background:#6c3fa0;color:white;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:bold;">Go to Login</a>
                </div>
              </div>
              <p style="color:#888;font-size:13px;text-align:center;line-height:1.5;">The quick-access link expires in 24 hours.</p>
              <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">
              <p style="color:#888;font-size:12px;text-align:center;">Dr. Sleepy — Peaceful nights for the whole family 🌙</p>
            </div>
          </div>
        </body></html>
      `,
    });

    return new Response(JSON.stringify({
      success: true,
      message: `Email sent to ${email}. User created. Test both magic link and password.`,
      password_for_verification: password,
      magic_link: magicLinkUrl,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
