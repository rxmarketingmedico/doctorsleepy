import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Pause, Music, Clock, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { AvatarAI } from "@/components/AvatarAI";

interface AudioItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  audio_url: string;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  author: string | null;
  is_premium: boolean | null;
  play_count: number | null;
}

const formatDuration = (seconds: number | null) => {
  if (!seconds) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatCurrentTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function AudioLibrary() {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState<AudioItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const { data: audios, isLoading } = useQuery({
    queryKey: ["audio-library"],
    queryFn: async () => {
      const { data, error } = await supabase.from("audio_library").select("*").order("title");
      if (error) throw error;
      return data as AudioItem[];
    },
  });

  const lullabies = audios?.filter((a) => a.category === "lullaby") || [];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setInitialDuration = () => {
      setDuration(audio.duration);
    };

    const setInitialVolume = () => {
      audio.volume = volume;
    };

    audio.addEventListener("loadedmetadata", setInitialDuration);
    audio.addEventListener("volumechange", setInitialVolume);

    return () => {
      audio.removeEventListener("loadedmetadata", setInitialDuration);
      audio.removeEventListener("volumechange", setInitialVolume);
    };
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const playTrack = async (track: AudioItem) => {
    if (currentTrack?.id === track.id) { togglePlayPause(); return; }
    setCurrentTrack(track); setIsPlaying(true); setCurrentTime(0);
    if (audioRef.current) { audioRef.current.src = track.audio_url; audioRef.current.play(); }
    const { data: { session } } = await supabase.auth.getSession();
    if (session) { await supabase.from("audio_plays").insert({ user_id: session.user.id, audio_id: track.id }); }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) { audioRef.current.currentTime = value[0]; setCurrentTime(value[0]); }
  };

  const skipTrack = (direction: "next" | "prev") => {
    if (!currentTrack || !audios) return;
    const currentList = lullabies;
    const currentIndex = currentList.findIndex((a) => a.id === currentTrack.id);
    let newIndex;
    if (direction === "next") { newIndex = (currentIndex + 1) % currentList.length; }
    else { newIndex = currentIndex === 0 ? currentList.length - 1 : currentIndex - 1; }
    playTrack(currentList[newIndex]);
  };

  const AudioCard = ({ audio }: { audio: AudioItem }) => {
    const isActive = currentTrack?.id === audio.id;
    const isThisPlaying = isActive && isPlaying;
    return (
      <Card className={cn("cursor-pointer transition-all hover:shadow-md", isActive && "ring-2 ring-primary bg-primary/5")} onClick={() => playTrack(audio)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center transition-colors bg-violet-100 dark:bg-violet-900/30">
              {isThisPlaying ? (
                <div className="flex gap-0.5">
                  {[1, 2, 3].map((i) => (
                    <span key={i} className={cn("w-1 bg-primary rounded-full animate-pulse", i === 1 && "h-3", i === 2 && "h-5", i === 3 && "h-3")} style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              ) : (<Music className="w-6 h-6 text-violet-600 dark:text-violet-400" />)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">{audio.title}</h3>
              <p className="text-xs text-muted-foreground truncate">{audio.author}</p>
              {audio.description && <p className="text-xs text-muted-foreground/70 mt-0.5">{audio.description}</p>}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" /><span className="text-sm">{formatDuration(audio.duration_seconds)}</span>
            </div>
            <Button variant={isThisPlaying ? "default" : "ghost"} size="icon" className="rounded-full"
              onClick={(e) => { e.stopPropagation(); playTrack(audio); }}>
              {isThisPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <audio ref={audioRef} />
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full"><ArrowLeft className="w-5 h-5" /></Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">Audio Library</h1>
            <p className="text-xs text-muted-foreground">Stories and lullabies</p>
          </div>
          <AvatarAI size="sm" state={isPlaying ? "speaking" : "idle"} />
        </div>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto">
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse"><CardContent className="p-4"><div className="flex items-center gap-4"><div className="w-14 h-14 rounded-xl bg-muted" /><div className="flex-1 space-y-2"><div className="h-4 bg-muted rounded w-3/4" /><div className="h-3 bg-muted rounded w-1/2" /></div></div></CardContent></Card>
              ))}
            </div>
          ) : lullabies.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Music className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No music available</p>
            </div>
          ) : (lullabies.map((audio) => <AudioCard key={audio.id} audio={audio} />))}
        </div>
      </main>

      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border safe-area-bottom">
          <div className="max-w-lg mx-auto px-4 py-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-muted-foreground w-10">{formatCurrentTime(currentTime)}</span>
              <Slider value={[currentTime]} max={duration || 100} step={1} onValueChange={handleSeek} className="flex-1" />
              <span className="text-xs text-muted-foreground w-10 text-right">{formatCurrentTime(duration)}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate text-sm">{currentTrack.title}</p>
                <p className="text-xs text-muted-foreground truncate">{currentTrack.author}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => skipTrack("prev")}><SkipBack className="w-5 h-5" /></Button>
                <Button variant="default" size="icon" className="rounded-full w-12 h-12" onClick={togglePlayPause}>
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => skipTrack("next")}><SkipForward className="w-5 h-5" /></Button>
              </div>
              <div className="flex items-center gap-2 w-20">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <Slider value={[volume * 100]} max={100} step={1} onValueChange={(v) => setVolume(v[0] / 100)} className="flex-1" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
