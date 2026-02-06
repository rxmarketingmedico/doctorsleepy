import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const { state } = await req.json() as { state: "idle" | "thinking" | "speaking" | "listening" };

    const basePrompt = `A friendly 3D cartoon doctor character, Pixar style, cute and warm expression, wearing a white lab coat with a blue stethoscope. The character has soft features, warm skin tone, short brown hair, rosy cheeks. Clean circular portrait on a transparent/soft gradient background. High quality 3D render, professional lighting, smooth shading.`;

    const statePrompts: Record<string, string> = {
      idle: `${basePrompt} The doctor has a gentle, welcoming smile, looking directly at the viewer with kind eyes. Relaxed and approachable pose.`,
      thinking: `${basePrompt} The doctor has a thoughtful expression, looking slightly upward, one hand on chin, eyes slightly narrowed in concentration. Contemplative mood.`,
      speaking: `${basePrompt} The doctor has an animated expression, mouth slightly open as if explaining something, eyebrows raised, engaged and enthusiastic look.`,
      listening: `${basePrompt} The doctor has an attentive expression, head slightly tilted, eyes focused and caring, showing active listening and empathy.`,
    };

    const prompt = statePrompts[state] || statePrompts.idle;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error("Failed to generate avatar image");
    }

    const data = await response.json();
    console.log("AI response structure:", JSON.stringify(data, null, 2));
    
    // Try multiple paths to find the image
    let imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    // Alternative path if images is at content level
    if (!imageUrl && data.choices?.[0]?.message?.content) {
      const content = data.choices[0].message.content;
      if (Array.isArray(content)) {
        const imageContent = content.find((c: any) => c.type === 'image_url' || c.image_url);
        if (imageContent) {
          imageUrl = imageContent.image_url?.url || imageContent.url;
        }
      }
    }

    if (!imageUrl) {
      console.error("No image found in response. Full data:", JSON.stringify(data));
      throw new Error("No image generated");
    }

    return new Response(JSON.stringify({ imageUrl, state }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Generate avatar error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
