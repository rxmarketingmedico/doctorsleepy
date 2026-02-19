import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user from token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, context } = await req.json();

    // Get user profile for context
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // Get chat history for context (last 20 messages)
    const { data: chatHistory } = await supabase
      .from("chat_messages")
      .select("role, content, context_type, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    // Get sleep logs for routine context (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: sleepLogs } = await supabase
      .from("sleep_logs")
      .select("log_type, started_at, ended_at, notes, created_at")
      .eq("user_id", user.id)
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(50);

    // Format sleep logs for context
    const formatDuration = (start: string, end: string | null) => {
      if (!end) return "in progress";
      const diffMs = new Date(end).getTime() - new Date(start).getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
    };

    const logTypeNames: Record<string, string> = {
      sleep: "Night sleep",
      nap: "Nap",
      feeding: "Feeding",
      diaper: "Diaper change",
      crying: "Crying",
      play: "Playtime",
      bath: "Bath",
    };

    const routineContext = sleepLogs?.length ? sleepLogs.map(log => {
      const date = new Date(log.started_at).toLocaleDateString('en-US');
      const time = new Date(log.started_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const duration = formatDuration(log.started_at, log.ended_at);
      const type = logTypeNames[log.log_type] || log.log_type;
      return `- ${date} ${time}: ${type} (${duration})${log.notes ? ` - ${log.notes}` : ''}`;
    }).join('\n') : 'No routine records available';

    // Calculate baby age if birth date exists
    let babyAge = "";
    if (profile?.baby_birth_date) {
      const birthDate = new Date(profile.baby_birth_date);
      const now = new Date();
      const diffMonths = (now.getFullYear() - birthDate.getFullYear()) * 12 + 
                         (now.getMonth() - birthDate.getMonth());
      const diffDays = Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffMonths < 1) {
        babyAge = `${diffDays} dias`;
      } else if (diffMonths < 12) {
        babyAge = `${diffMonths} ${diffMonths === 1 ? 'mês' : 'meses'}`;
      } else {
        const years = Math.floor(diffMonths / 12);
        const months = diffMonths % 12;
        babyAge = `${years} ${years === 1 ? 'ano' : 'anos'}${months > 0 ? ` e ${months} ${months === 1 ? 'mês' : 'meses'}` : ''}`;
      }
    }

    // Format parent experience
    const experienceLabels: Record<string, string> = {
      none: "No prior experience with babies",
      some: "Some experience (nephews, godchildren, etc.)",
      experienced: "Experienced (has other children)",
    };

    // Format main concerns
    const concernLabels: Record<string, string> = {
      sleep: "Baby sleep",
      feeding: "Feeding",
      crying: "Excessive crying",
      development: "Development",
      routine: "Building a routine",
      health: "General health",
    };

    const feedingLabels: Record<string, string> = {
      breastfeeding: "Exclusive breastfeeding",
      formula: "Formula",
      mixed: "Mixed (breast + formula)",
      solids: "Solid food introduction",
    };

    const bedtimeLabels: Record<string, string> = {
      "before-19": "Before 7 PM",
      "19-20": "Between 7–8 PM",
      "20-21": "Between 8–9 PM",
      "21-22": "Between 9–10 PM",
      "after-22": "After 10 PM",
      "irregular": "No fixed schedule",
    };

    const conditionLabels: Record<string, string> = {
      reflux: "Reflux",
      colic: "Severe colic",
      premature: "Premature",
      allergy: "Food allergy",
      dermatitis: "Dermatitis",
    };

    const mainConcerns = (profile?.main_concerns as string[] | null)?.map(c => concernLabels[c] || c).join(", ") || "Not provided";
    const specialConditions = (profile?.special_conditions as string[] | null)?.filter(c => c !== "none").map(c => conditionLabels[c] || c).join(", ") || "None";

    // Build system prompt with profile context
    const systemPrompt = `You are Dr. Sleepy, a warm, empathetic, and caring virtual pediatrician specializing in infant sleep and baby care.

HOW YOU SHOULD ACT:
You act exactly like a pediatrician in a real consultation:
1. LISTEN carefully to what the parent reports
2. INVESTIGATE by asking specific questions to better understand the situation (one or two questions at a time, don't overwhelm)
3. Once you have enough information, give your ASSESSMENT/OPINION clearly and confidently
4. Always end by asking if the parent has any other questions or needs anything else

EXAMPLE APPROACH:
- Parent says: "My baby isn't sleeping well"
- You: "I understand your concern 💙 To help you better, tell me: how many nights has this been happening? And does the baby wake up crying or just restless?"
- After the answers, investigate further if needed, then give your professional opinion

PERSONALITY:
- Be EMPATHETIC and WARM — validate parents' feelings
- Use a caring, friendly tone, like a trusted doctor
- Convey confidence and calmness
- Use emojis sparingly to make the conversation welcoming (💙, 😊, 🌙)
- Always be polite and kind
- ALWAYS respond in English

PARENT INFORMATION:
${profile ? `
- Name: ${profile.parent_name || 'Not provided'}
- First child: ${profile.is_first_child ? 'Yes' : 'No'}
- Experience: ${experienceLabels[profile.parent_experience as string] || 'Not provided'}
- Support network: ${profile.has_support_network ? 'Yes' : 'No support network'}
- Main concerns: ${mainConcerns}
` : 'Profile not available.'}

BABY INFORMATION:
${profile ? `
- Baby's name: ${profile.baby_name || 'Not provided'}
- Baby's age: ${babyAge || 'Not provided'}
- Feeding type: ${feedingLabels[profile.feeding_type as string] || 'Not provided'}
- Sleep location: ${profile.sleep_location || 'Not provided'}
- Uses pacifier: ${profile.uses_pacifier ? 'Yes' : 'No'}
- Night feedings: ${profile.night_feedings || 'Not provided'} times per night
- Usual bedtime: ${bedtimeLabels[profile.usual_bedtime as string] || 'Not provided'}
- Main challenge: ${profile.main_challenge || 'Not provided'}
- Special conditions: ${specialConditions}
` : 'Baby data not available.'}

ROUTINE — LAST 7 DAYS:
${routineContext}

CURRENT CONVERSATION CONTEXT: ${context || 'General conversation'}

RECENT HISTORY:
${chatHistory?.reverse().map(msg => `${msg.role === 'user' ? 'Parent' : 'Dr. Sleepy'}: ${msg.content.substring(0, 200)}...`).join('\n') || 'First interaction'}

RULES:
1. Use the baby's and parent's name when known
2. Ask NO MORE THAN 2 investigative questions per message
3. When you have enough information, give your opinion confidently
4. Always end with something like "Can I help you with anything else?" or "Do you have any other questions?"
5. For medical red flags, ALWAYS recommend seeking in-person care
6. Keep responses concise but complete (max 400 words)
7. If the parent seems anxious or exhausted, validate that first

DISCLAIMER: You provide general guidance and do NOT replace professional medical advice.`;

    // Save user message to database
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage?.role === "user") {
      await supabase.from("chat_messages").insert({
        user_id: user.id,
        role: "user",
        content: lastUserMessage.content,
        context_type: context,
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados. Entre em contato com o suporte." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Erro ao processar sua mensagem" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
