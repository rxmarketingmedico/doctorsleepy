import { useNavigate } from "react-router-dom";
import { Utensils, Moon, Thermometer, Baby, Clock } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { EmergencyButton } from "@/components/EmergencyButton";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";

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
          <h1 className="text-xl font-bold text-foreground">Doutor Soneca</h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-lg mx-auto">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <Avatar size="xl" state="idle" />
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
      </main>

      <BottomNav />
    </div>
  );
}
