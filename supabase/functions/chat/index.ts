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
      if (!end) return "em andamento";
      const diffMs = new Date(end).getTime() - new Date(start).getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
    };

    const logTypeNames: Record<string, string> = {
      sleep: "Sono noturno",
      nap: "Soneca",
      feeding: "Mamada",
      diaper: "Troca de fralda",
      crying: "Choro",
      play: "Brincadeira",
      bath: "Banho",
    };

    const routineContext = sleepLogs?.length ? sleepLogs.map(log => {
      const date = new Date(log.started_at).toLocaleDateString('pt-BR');
      const time = new Date(log.started_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const duration = formatDuration(log.started_at, log.ended_at);
      const type = logTypeNames[log.log_type] || log.log_type;
      return `- ${date} ${time}: ${type} (${duration})${log.notes ? ` - ${log.notes}` : ''}`;
    }).join('\n') : 'Nenhum registro de rotina disponível';

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
      none: "Sem experiência prévia com bebês",
      some: "Alguma experiência (sobrinhos, afilhados, etc.)",
      experienced: "Experiente (tem outros filhos)",
    };

    // Format main concerns
    const concernLabels: Record<string, string> = {
      sleep: "Sono do bebê",
      feeding: "Alimentação",
      crying: "Choro excessivo",
      development: "Desenvolvimento",
      routine: "Criar rotina",
      health: "Saúde geral",
    };

    const mainConcerns = (profile?.main_concerns as string[] | null)?.map(c => concernLabels[c] || c).join(", ") || "Não informado";

    // Build system prompt with profile context
    const systemPrompt = `Você é o Doutor Soneca, um especialista amigável e empático em sono infantil e cuidados com bebês. Você ajuda pais com orientações sobre sono, choro, alimentação e bem-estar do bebê.

INFORMAÇÕES DO RESPONSÁVEL:
${profile ? `
- Nome: ${profile.parent_name || 'Não informado'}
- Primeiro filho: ${profile.is_first_child ? 'Sim' : 'Não'}
- Experiência: ${experienceLabels[profile.parent_experience as string] || 'Não informado'}
- Rede de apoio: ${profile.has_support_network ? 'Sim, tem apoio de família/amigos' : 'Não tem rede de apoio'}
- Principais preocupações: ${mainConcerns}
` : 'Perfil não disponível.'}

INFORMAÇÕES DO BEBÊ:
${profile ? `
- Nome do bebê: ${profile.baby_name || 'Não informado'}
- Idade do bebê: ${babyAge || 'Não informado'}
- Local de sono: ${profile.sleep_location || 'Não informado'}
- Usa chupeta: ${profile.uses_pacifier ? 'Sim' : 'Não'}
- Mamadas noturnas: ${profile.night_feedings || 'Não informado'} vezes por noite
` : 'Dados do bebê não disponíveis.'}

ROTINA DOS ÚLTIMOS 7 DIAS:
${routineContext}

CONTEXTO DA CONVERSA ATUAL: ${context || 'Conversa geral'}

HISTÓRICO RECENTE (últimas interações):
${chatHistory?.reverse().map(msg => `${msg.role === 'user' ? 'Pai/Mãe' : 'Doutor Soneca'}: ${msg.content.substring(0, 200)}...`).join('\n') || 'Primeira interação'}

DIRETRIZES IMPORTANTES:
1. Sempre use o nome do bebê e do responsável quando souber
2. RESPONDA APENAS o que foi perguntado. NÃO dê orientações extras, dicas não solicitadas ou sugestões proativas
3. Seja direto e objetivo na resposta
4. Adapte a linguagem ao nível de experiência do responsável
5. Se é o primeiro filho, seja acolhedor mas sem adicionar informações não pedidas
6. Em caso de sinais de alerta médico, SEMPRE recomende procurar um profissional
7. Mantenha respostas concisas (máximo 300 palavras)
8. Use emojis moderadamente para tornar a conversa mais acolhedora
9. NÃO faça perguntas de acompanhamento a menos que seja essencial para responder a dúvida do usuário

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
