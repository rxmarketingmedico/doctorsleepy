import { useNavigate } from "react-router-dom";
import { Utensils, Moon, Thermometer, Baby, Clock, Music, BookOpen, MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import { AvatarAI } from "@/components/AvatarAI";
import { EmergencyButton } from "@/components/EmergencyButton";
import { BottomNav } from "@/components/BottomNav";
import { GuidedTutorial } from "@/components/GuidedTutorial";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-dr-sleepy.webp";

const emergencyOptions = [
  { icon: Utensils, label: "Could it be hunger?", variant: "hunger" as const, context: "hunger" },
  { icon: Moon, label: "Could it be sleep?", variant: "sleep" as const, context: "sleep" },
  { icon: Thermometer, label: "Could it be discomfort?", variant: "discomfort" as const, context: "discomfort" },
  { icon: Baby, label: "Inconsolable crying", variant: "cry" as const, context: "inconsolable" },
  { icon: Clock, label: "Woke up at night", variant: "night" as const, context: "night-waking" },
];

export default function Home() {
  const navigate = useNavigate();

  const handleEmergencyClick = (context: string) => {
    navigate(`/chat?context=${context}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <img src={logo} alt="Dr. Sleepy" className="h-12" />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-lg mx-auto">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <AvatarAI size="xl" state="idle" />
          <h2 className="mt-4 text-2xl font-bold text-foreground">Emergency Mode</h2>
          <p className="text-muted-foreground text-center mt-2">
            Is your baby crying? Choose the option that best describes the situation.
          </p>
        </div>

        {/* Emergency Buttons Grid */}
        <div className="grid grid-cols-2 gap-4">
          {emergencyOptions.slice(0, 4).map((option) => (
            <EmergencyButton
              key={option.context}
              icon={option.icon}
              label={option.label}
              variant={option.variant}
              onClick={() => handleEmergencyClick(option.context)}
            />
          ))}
        </div>

        {/* Full-width button for night waking */}
        <div className="mt-4">
          <EmergencyButton
            icon={emergencyOptions[4].icon}
            label={emergencyOptions[4].label}
            variant={emergencyOptions[4].variant}
            onClick={() => handleEmergencyClick(emergencyOptions[4].context)}
          />
        </div>

        {/* Free Chat Card */}
        <Card 
          className="mt-6 cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800"
          onClick={() => navigate("/chat?context=general")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground">Chat with the Doctor</h3>
                <p className="text-sm text-muted-foreground">
                  Ask about sleep, feeding, and baby care
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audio Library Card */}
        <Card 
          className="mt-4 cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 border-violet-200 dark:border-violet-800"
          onClick={() => navigate("/audio-library")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center shadow-lg">
                <Music className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground">Lullaby Time</h3>
                <p className="text-sm text-muted-foreground">
                  Lullabies to help your baby fall asleep
                </p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <BookOpen className="w-5 h-5 text-violet-500" />
                <span className="text-xs text-muted-foreground">10+</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Library Card */}
        <Card 
          className="mt-4 cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800"
          onClick={() => navigate("/library")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground">Content Library</h3>
                <p className="text-sm text-muted-foreground">
                  Articles about sleep, feeding, and baby routines
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Routine Nudge Banner */}
        <Card 
          className="mt-4 cursor-pointer hover:shadow-lg transition-all border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20"
          onClick={() => navigate("/routine")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Make Dr. Sleepy smarter! 🧠
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Log your baby's routine to receive more precise and personalized guidance.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
      <GuidedTutorial />
    </div>
  );
}
