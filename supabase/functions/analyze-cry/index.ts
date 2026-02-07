import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CryCharacteristics {
  intensity: "low" | "medium" | "high";
  pattern: "continuous" | "intermittent" | "rhythmic";
  pitch: "low" | "medium" | "high";
  duration: "short" | "medium" | "long";
  additionalNotes?: string;
}

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

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { characteristics, audioBase64 } = await req.json() as {
      characteristics: CryCharacteristics;
      audioBase64?: string;
    };

    // Get user profile for context
    const { data: profile } = await supabase
      .from("profiles")
      .select("baby_name, baby_birth_date")
      .eq("user_id", user.id)
      .maybeSingle();

    // Calculate baby age
    let babyAge = "não informada";
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
        babyAge = `${years} ${years === 1 ? 'ano' : 'anos'}`;
      }
    }

    const intensityMap = { low: "baixa", medium: "média", high: "alta" };
    const patternMap = { continuous: "contínuo", intermittent: "intermitente", rhythmic: "rítmico" };
    const pitchMap = { low: "grave", medium: "médio", high: "agudo" };
    const durationMap = { short: "curta (poucos segundos)", medium: "média (alguns minutos)", long: "longa (mais de 5 minutos)" };

    const systemPrompt = `Você é o Dr. Soneca, um pediatra especialista em sono infantil e análise de choro de bebês com mais de 20 anos de experiência. Sua função é analisar as características do choro descritas e fornecer uma análise detalhada, personalizada e acolhedora.

CONTEXTO DO BEBÊ:
- Use o nome do bebê nas respostas para torná-las pessoais
- Considere a idade do bebê para contextualizar as causas (recém-nascidos têm padrões diferentes de bebês maiores)
- Bebês de 0-3 meses: cólicas são mais comuns, reflexo de Moro pode causar choro súbito
- Bebês de 3-6 meses: regressão de sono, início da dentição
- Bebês de 6-12 meses: ansiedade de separação, saltos de desenvolvimento
- Bebês de 1-2 anos: birras, medos noturnos, necessidade de autonomia

PADRÕES DE CHORO DETALHADOS:
- **Fome**: Choro rítmico "né-né", começa suave e escala, movimentos de sucção, mãos na boca, vira a cabeça buscando o peito
- **Desconforto/Fralda**: Choro intermitente e irritadiço, bebê se contorce, puxa as roupas
- **Sono/Cansaço**: Choro queixoso e monótono "owh-owh", olhos pesados, esfrega olhos/orelhas, bocejos, movimentos descoordenados
- **Cólica/Gases**: Choro intenso e agudo, pernas encolhidas contra barriga, face avermelhada, punhos cerrados, geralmente no final da tarde/noite
- **Dor**: Choro agudo, súbito e penetrante, contínuo e difícil de acalmar, pode ter pausas por exaustão
- **Emocional/Colo**: Choro que para quando pegam no colo, busca contato visual, estende os braços
- **Tédio/Estimulação**: Choro fraco que para com distração, olhar curioso entre episódios
- **Superestimulação**: Choro após atividade intensa, vira o rosto, fecha os olhos

IMPORTANTE: 
- Esta é uma ferramenta de APOIO e NÃO substitui avaliação médica profissional
- Seja empático e acolhedor com os pais - eles estão cansados e preocupados
- Dê sugestões práticas e imediatas que os pais possam aplicar agora

Retorne sua análise no seguinte formato JSON:
{
  "analysis": {
    "hunger": <0-100>,
    "discomfort": <0-100>,
    "sleep": <0-100>,
    "colic": <0-100>,
    "pain": <0-100>,
    "emotional": <0-100>
  },
  "primaryCause": "<causa mais provável em português, ex: Fome, Sono, Cólica>",
  "suggestion": "<sugestão detalhada e personalizada com o nome do bebê, 2-4 frases com ações práticas imediatas que o pai/mãe pode fazer agora>",
  "details": "<explicação mais aprofundada de 3-5 frases sobre por que você chegou a essa conclusão, considerando a idade e características específicas do bebê>",
  "soothingTips": ["<dica prática 1>", "<dica prática 2>", "<dica prática 3>"],
  "warning": "<se houver sinais de alerta (choro inconsolável por mais de 3h, febre, recusa alimentar), mencionar aqui com orientação clara. Caso contrário, null>"
}`;

    const userMessage = `Analise o choro de um bebê com as seguintes características:

**Informações do Bebê:**
- Nome: ${profile?.baby_name || "Bebê"}
- Idade: ${babyAge}

**Características do Choro Observadas:**
- Intensidade: ${intensityMap[characteristics.intensity]}
- Padrão: ${patternMap[characteristics.pattern]}
- Tom/Pitch: ${pitchMap[characteristics.pitch]}
- Duração: ${durationMap[characteristics.duration]}
${characteristics.additionalNotes ? `- Observações adicionais: ${characteristics.additionalNotes}` : ""}

Por favor, forneça sua análise em formato JSON.`;

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
          { role: "user", content: userMessage },
        ],
        response_format: { type: "json_object" },
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
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response from AI");
    }

    const analysisResult = JSON.parse(content);

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Cry analysis error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Erro ao analisar o choro" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
