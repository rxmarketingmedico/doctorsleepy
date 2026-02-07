import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const JAMENDO_CLIENT_ID = Deno.env.get("JAMENDO_CLIENT_ID");
    if (!JAMENDO_CLIENT_ID) {
      throw new Error("JAMENDO_CLIENT_ID is not configured");
    }

    const { query, limit = 20 } = await req.json();

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Search Jamendo for lullabies/children music
    const url = new URL("https://api.jamendo.com/v3.0/tracks/");
    url.searchParams.set("client_id", JAMENDO_CLIENT_ID);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", String(Math.min(limit, 50)));
    url.searchParams.set("search", query.trim());
    url.searchParams.set("include", "musicinfo");
    url.searchParams.set("boost", "popularity_total");
    url.searchParams.set("audioformat", "mp32");

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Jamendo API error:", response.status, errorText);
      throw new Error(`Jamendo API error [${response.status}]`);
    }

    const data = await response.json();

    // Map to a simpler format
    const tracks = (data.results || []).map((track: any) => ({
      id: `jamendo-${track.id}`,
      jamendo_id: track.id,
      title: track.name,
      artist: track.artist_name,
      duration_seconds: track.duration,
      audio_url: track.audio, // streaming URL
      image: track.image || track.album_image,
      album: track.album_name,
    }));

    return new Response(
      JSON.stringify({ tracks }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("search-jamendo error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
