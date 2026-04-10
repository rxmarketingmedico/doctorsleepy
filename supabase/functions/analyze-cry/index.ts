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
    let babyAge = "not provided";
    if (profile?.baby_birth_date) {
      const birthDate = new Date(profile.baby_birth_date);
      const now = new Date();
      const diffMonths = (now.getFullYear() - birthDate.getFullYear()) * 12 + 
                         (now.getMonth() - birthDate.getMonth());
      const diffDays = Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffMonths < 1) {
        babyAge = `${diffDays} days`;
      } else if (diffMonths < 12) {
        babyAge = `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'}`;
      } else {
        const years = Math.floor(diffMonths / 12);
        babyAge = `${years} ${years === 1 ? 'year' : 'years'}`;
      }
    }

    const intensityMap = { low: "low", medium: "medium", high: "high" };
    const patternMap = { continuous: "continuous", intermittent: "intermittent", rhythmic: "rhythmic" };
    const pitchMap = { low: "low", medium: "medium", high: "high-pitched" };
    const durationMap = { short: "short (a few seconds)", medium: "medium (a few minutes)", long: "long (more than 5 minutes)" };

    const systemPrompt = `You are Dr. Sleepy, a pediatrician specializing in infant sleep and baby cry analysis with over 20 years of experience. Your role is to analyze the described cry characteristics and provide a detailed, personalized, and compassionate analysis.

BABY CONTEXT:
- Use the baby's name in responses to make them personal
- Consider the baby's age to contextualize causes (newborns have different patterns than older babies)
- Babies 0-3 months: colic is more common, Moro reflex can cause sudden crying
- Babies 3-6 months: sleep regression, teething begins
- Babies 6-12 months: separation anxiety, developmental leaps
- Babies 1-2 years: tantrums, nighttime fears, need for autonomy

DETAILED CRY PATTERNS:
- **Hunger**: Rhythmic cry, starts soft and escalates, sucking movements, hands to mouth, turns head seeking breast
- **Discomfort/Diaper**: Intermittent and fussy cry, baby squirms, pulls at clothes
- **Sleep/Tiredness**: Whiny and monotonous cry, heavy eyelids, rubs eyes/ears, yawning, uncoordinated movements
- **Colic/Gas**: Intense and high-pitched cry, legs pulled against belly, red face, clenched fists, usually late afternoon/evening
- **Pain**: Sharp, sudden and piercing cry, continuous and hard to soothe, may have pauses from exhaustion
- **Emotional/Comfort**: Cry that stops when picked up, seeks eye contact, reaches out arms
- **Boredom/Stimulation**: Weak cry that stops with distraction, curious gaze between episodes
- **Overstimulation**: Cry after intense activity, turns face away, closes eyes

IMPORTANT: 
- This is a SUPPORT tool and does NOT replace professional medical evaluation
- Be empathetic and supportive with parents — they are tired and worried
- Give practical and immediate suggestions that parents can apply right now
- ALWAYS respond in English

Return your analysis in the following JSON format:
{
  "analysis": {
    "hunger": <0-100>,
    "discomfort": <0-100>,
    "sleep": <0-100>,
    "colic": <0-100>,
    "pain": <0-100>,
    "emotional": <0-100>
  },
  "primaryCause": "<most likely cause in English, e.g.: Hunger, Sleepiness, Colic>",
  "suggestion": "<detailed and personalized suggestion using the baby's name, 2-4 sentences with practical immediate actions the parent can take now>",
  "details": "<more in-depth explanation of 3-5 sentences about why you reached this conclusion, considering the baby's age and specific characteristics>",
  "soothingTips": ["<practical tip 1>", "<practical tip 2>", "<practical tip 3>"],
  "warning": "<if there are warning signs (inconsolable crying for more than 3h, fever, refusal to eat), mention here with clear guidance. Otherwise, null>"
}`;

    const userMessage = `Analyze a baby's cry with the following characteristics:

**Baby Information:**
- Name: ${profile?.baby_name || "Baby"}
- Age: ${babyAge}

**Observed Cry Characteristics:**
- Intensity: ${intensityMap[characteristics.intensity]}
- Pattern: ${patternMap[characteristics.pattern]}
- Pitch: ${pitchMap[characteristics.pitch]}
- Duration: ${durationMap[characteristics.duration]}
${characteristics.additionalNotes ? `- Additional notes: ${characteristics.additionalNotes}` : ""}

Please provide your analysis in JSON format.`;

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
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a few seconds." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
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
      error: error instanceof Error ? error.message : "Error analyzing the cry" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
