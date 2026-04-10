import { useState } from "react";
import { Search, Play, Pause, Loader2, Music, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export interface JamendoTrack {
  id: string;
  jamendo_id: string;
  title: string;
  artist: string;
  duration_seconds: number;
  audio_url: string;
  image: string;
  album: string;
}

interface JamendoSearchProps {
  onPlayTrack: (track: {
    id: string;
    title: string;
    author: string;
    audio_url: string;
    duration_seconds: number;
    category: string;
    description: string | null;
    thumbnail_url: string | null;
    is_premium: boolean | null;
    play_count: number | null;
  }) => void;
  currentTrackId: string | null;
  isPlaying: boolean;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const quickSearches = [
  { label: "🎵 Lullaby", query: "lullaby baby" },
  { label: "😴 Sleep", query: "sleep baby calm" },
  { label: "🎹 Piano", query: "piano lullaby" },
  { label: "🌊 Nature", query: "nature rain ocean" },
  { label: "🎶 Music Box", query: "music box melody" },
  { label: "🌙 Bedtime", query: "bedtime soothing" },
];

export function JamendoSearch({ onPlayTrack, currentTrackId, isPlaying }: JamendoSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<JamendoTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeQuick, setActiveQuick] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);

    try {
      const { data, error } = await supabase.functions.invoke("search-jamendo", {
        body: { query: query.trim(), limit: 20 },
      });

      if (error) throw error;
      setResults(data.tracks || []);
    } catch (err) {
      console.error("Jamendo search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (track: JamendoTrack) => {
    onPlayTrack({
      id: track.id,
      title: track.title,
      author: track.artist,
      audio_url: track.audio_url,
      duration_seconds: track.duration_seconds,
      category: "jamendo",
      description: track.album,
      thumbnail_url: track.image,
      is_premium: false,
      play_count: null,
    });
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex gap-2"
      >
        <Input
          placeholder="Search lullabies, stories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !query.trim()} size="icon">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground">
        Powered by <a href="https://www.jamendo.com" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-0.5">Jamendo <ExternalLink className="w-3 h-3" /></a> — free licensed music
      </p>

      {/* Quick search chips */}
      <div className="flex flex-wrap gap-2">
        {quickSearches.map((qs) => (
          <Button
            key={qs.query}
            variant={activeQuick === qs.query ? "default" : "outline"}
            size="sm"
            className="rounded-full text-xs h-8"
            onClick={() => {
              setQuery(qs.query);
              setActiveQuick(qs.query);
              setLoading(true);
              setSearched(true);
              supabase.functions.invoke("search-jamendo", {
                body: { query: qs.query, limit: 20 },
              }).then(({ data, error }) => {
                if (!error && data) setResults(data.tracks || []);
                else setResults([]);
                setLoading(false);
              });
            }}
            disabled={loading}
          >
            {qs.label}
          </Button>
        ))}
      </div>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No results found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-3">
          {results.map((track) => {
            const isActive = currentTrackId === track.id;
            const isThisPlaying = isActive && isPlaying;

            return (
              <Card
                key={track.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  isActive && "ring-2 ring-primary bg-primary/5"
                )}
                onClick={() => handlePlay(track)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {track.image ? (
                        <img
                          src={track.image}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate text-sm">
                        {track.title}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {track.artist}
                      </p>
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {formatDuration(track.duration_seconds)}
                    </span>

                    <Button
                      variant={isThisPlaying ? "default" : "ghost"}
                      size="icon"
                      className="rounded-full h-9 w-9"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlay(track);
                      }}
                    >
                      {isThisPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!searched && !loading && (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Search for lullabies and stories</p>
          <p className="text-sm mt-1">for children across the Jamendo library</p>
        </div>
      )}
    </div>
  );
}
