import { useState, useEffect, useCallback } from "react";
import { Home, Calendar, Mic, HelpCircle, User, MessageCircle, Music, X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ElementType;
  position: "center" | "bottom-nav";
  navIndex?: number;
  color: string;
}

const steps: TutorialStep[] = [
  {
    title: "Welcome to Dr. Sleepy! 👋",
    description: "Let me quickly show you how to use the app to care for your baby's sleep. Just 6 steps!",
    icon: Sparkles, position: "center", color: "from-primary to-primary/80",
  },
  {
    title: "Emergency Mode 🚨",
    description: "On the home screen, tap the button that describes your baby's situation to receive immediate AI guidance.",
    icon: Home, position: "bottom-nav", navIndex: 0, color: "from-blue-500 to-blue-600",
  },
  {
    title: "Baby's Routine 📋",
    description: "Log sleep, feedings, and diaper changes. The AI analyzes patterns and suggests improvements.",
    icon: Calendar, position: "bottom-nav", navIndex: 1, color: "from-indigo-500 to-indigo-600",
  },
  {
    title: "Cry Translator 🎤",
    description: "Record the baby's cry and the AI identifies the possible reason: hunger, sleep, discomfort, or colic.",
    icon: Mic, position: "bottom-nav", navIndex: 2, color: "from-violet-500 to-violet-600",
  },
  {
    title: "Help Center 💬",
    description: "Open support tickets and chat directly with our team when you need extra help.",
    icon: HelpCircle, position: "bottom-nav", navIndex: 3, color: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Your Profile ⚙️",
    description: "Manage your plan, edit baby info, and adjust app settings.",
    icon: User, position: "bottom-nav", navIndex: 4, color: "from-amber-500 to-amber-600",
  },
];

const TUTORIAL_KEY = "dr_sleepy_tutorial_completed";

export function GuidedTutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(TUTORIAL_KEY);
    if (!completed) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const completeTutorial = useCallback(() => {
    setExiting(true);
    setTimeout(() => { localStorage.setItem(TUTORIAL_KEY, "true"); setVisible(false); }, 300);
  }, []);

  const next = () => { if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1); else completeTutorial(); };
  const prev = () => { if (currentStep > 0) setCurrentStep((s) => s - 1); };

  if (!visible) return null;

  const step = steps[currentStep];
  const Icon = step.icon;
  const isLast = currentStep === steps.length - 1;
  const isFirst = currentStep === 0;

  return (
    <div className={cn("fixed inset-0 z-[100] flex flex-col items-center justify-end transition-opacity duration-300", exiting ? "opacity-0" : "opacity-100")}>
      <div className="absolute inset-0 bg-black/60" onClick={completeTutorial} />

      {step.position === "bottom-nav" && step.navIndex !== undefined && (
        <div className="absolute bottom-0 left-0 right-0 z-[101] safe-area-bottom">
          <div className="max-w-lg mx-auto h-16 flex justify-around items-center px-2 bg-card border-t border-border">
            {[Home, Calendar, Mic, HelpCircle, User].map((NavIcon, i) => {
              const labels = ["Home", "Routine", "Translator", "Help", "Profile"];
              const isHighlighted = i === step.navIndex;
              return (
                <div key={i} className="flex flex-col items-center justify-center gap-1 py-2 px-3">
                  <div className={cn("flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition-all",
                    isHighlighted ? "text-primary bg-primary/15 ring-2 ring-primary ring-offset-2 ring-offset-card scale-110 animate-[soft-bounce_1.5s_ease-in-out_infinite]" : "text-muted-foreground/40"
                  )}>
                    <NavIcon className="w-5 h-5" />
                    <span className="text-xs font-medium">{labels[i]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={cn("relative z-[102] w-full max-w-sm mx-4 mb-24 rounded-3xl bg-card border border-border shadow-2xl overflow-hidden transition-all duration-300", exiting ? "translate-y-8 scale-95" : "translate-y-0 scale-100")}>
        <button onClick={completeTutorial} className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10"><X className="w-4 h-4" /></button>
        <div className={cn("flex justify-center pt-6 pb-2")}>
          <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg", step.color)}><Icon className="w-8 h-8 text-white" /></div>
        </div>
        <div className="px-6 pb-2 text-center">
          <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
        </div>
        <div className="flex justify-center gap-1.5 py-3">
          {steps.map((_, i) => (<div key={i} className={cn("h-1.5 rounded-full transition-all duration-300", i === currentStep ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30")} />))}
        </div>
        <div className="flex items-center gap-2 px-6 pb-6">
          {!isFirst && (<Button variant="ghost" size="sm" onClick={prev} className="rounded-xl"><ChevronLeft className="w-4 h-4 mr-1" />Back</Button>)}
          <Button className="flex-1 rounded-xl" onClick={next}>
            {isLast ? "Start using!" : "Next"}{!isLast && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
