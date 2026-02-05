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

    // Build system prompt with profile context
    const systemPrompt = `Você é o Doutor Soneca, um especialista amigável e empático em sono infantil e cuidados com bebês. Você ajuda pais de primeira viagem com orientações sobre sono, choro, alimentação e bem-estar do bebê.

INFORMAÇÕES DO BEBÊ E FAMÍLIA:
${profile ? `
- Nome do bebê: ${profile.baby_name || 'Não informado'}
- Idade do bebê: ${babyAge || 'Não informado'}
- Nome do responsável: ${profile.parent_name || 'Não informado'}
- Local de sono: ${profile.sleep_location || 'Não informado'}
- Usa chupeta: ${profile.uses_pacifier ? 'Sim' : 'Não'}
- Mamadas noturnas: ${profile.night_feedings || 'Não informado'} vezes por noite
` : 'Perfil não disponível - pergunte informações básicas sobre o bebê.'}

CONTEXTO DA CONVERSA ATUAL: ${context || 'Conversa geral'}

HISTÓRICO RECENTE (últimas interações):
${chatHistory?.reverse().map(msg => `${msg.role === 'user' ? 'Pai/Mãe' : 'Doutor Soneca'}: ${msg.content.substring(0, 200)}...`).join('\n') || 'Primeira interação'}

DIRETRIZES:
1. Sempre use o nome do bebê quando souber
2. Adapte suas respostas à idade do bebê
3. Seja acolhedor e empático - pais de primeira viagem precisam de apoio
4. Forneça orientações práticas e baseadas em evidências
5. Use formatação markdown para organizar informações (listas, bold, etc.)
6. Em caso de sinais de alerta médico, SEMPRE recomende procurar um profissional
7. Mantenha respostas concisas mas completas (máximo 400 palavras)
8. Use emojis moderadamente para tornar a conversa mais acolhedora
9. Lembre-se do histórico da conversa para dar continuidade natural

AVISO IMPORTANTE: Você oferece orientações gerais e NÃO substitui aconselhamento médico profissional.`;

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
