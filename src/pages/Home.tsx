import { useNavigate } from "react-router-dom";
import { Utensils, Moon, Thermometer, Baby, Clock, Music, BookOpen, MessageCircle } from "lucide-react";
import { AvatarAI } from "@/components/AvatarAI";
import { EmergencyButton } from "@/components/EmergencyButton";
import { BottomNav } from "@/components/BottomNav";
import { GuidedTutorial } from "@/components/GuidedTutorial";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent } from "@/components/ui/card";
import logo from "@/assets/logo-doutor-soneca.png";

const emergencyOptions = [
  { icon: Utensils, label: "Pode ser fome?", variant: "hunger" as const, context: "hunger" },
  { icon: Moon, label: "Pode ser sono?", variant: "sleep" as const, context: "sleep" },
  { icon: Thermometer, label: "Pode ser desconforto?", variant: "discomfort" as const, context: "discomfort" },
  { icon: Baby, label: "Choro inconsolável", variant: "cry" as const, context: "inconsolable" },
  { icon: Clock, label: "Acordou de madrugada", variant: "night" as const, context: "night-waking" },
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
          <img src={logo} alt="Doutor Soneca" className="h-10" />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-lg mx-auto">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <AvatarAI size="xl" state="idle" />
          <h2 className="mt-4 text-2xl font-bold text-foreground">Modo Emergência</h2>
          <p className="text-muted-foreground text-center mt-2">
            Seu bebê está chorando? Escolha a opção que melhor descreve a situação.
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
                <h3 className="font-bold text-foreground">Conversar com o Doutor</h3>
                <p className="text-sm text-muted-foreground">
                  Tire suas dúvidas sobre sono, alimentação e cuidados
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
                <h3 className="font-bold text-foreground">Hora de Ninar</h3>
                <p className="text-sm text-muted-foreground">
                  Músicas de ninar para ajudar seu bebê a dormir
                </p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <BookOpen className="w-5 h-5 text-violet-500" />
                <span className="text-xs text-muted-foreground">10+</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
      <GuidedTutorial />
    </div>
  );
}
