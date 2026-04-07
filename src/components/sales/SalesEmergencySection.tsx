import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Baby, Utensils, Moon, Frown, AlertTriangle } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { useSalesT } from "@/contexts/SalesLanguageContext";

const LOOP_RESTART = 4000;

export default function SalesEmergencySection() {
  const { t } = useSalesT();

  const emergencyButtons = [
    { icon: Utensils, label: t("emergency.hunger"), color: "bg-amber-500/15 text-amber-600", desc: t("emergency.hunger.desc") },
    { icon: Moon, label: t("emergency.sleepiness"), color: "bg-blue-500/15 text-blue-600", desc: t("emergency.sleepiness.desc") },
    { icon: Frown, label: t("emergency.discomfort"), color: "bg-orange-500/15 text-orange-600", desc: t("emergency.discomfort.desc") },
    { icon: Baby, label: t("emergency.intenseCrying"), color: "bg-red-500/15 text-red-600", desc: t("emergency.intenseCrying.desc") },
    { icon: AlertTriangle, label: t("emergency.wokeUp"), color: "bg-purple-500/15 text-purple-600", desc: t("emergency.wokeUp.desc") },
  ];

  const emergencyResponse = {
    title: t("emergency.nightWaking"),
    steps: [t("emergency.step1"), t("emergency.step2"), t("emergency.step3"), t("emergency.step4"), t("emergency.step5")],
    tip: t("emergency.tip"),
  };

  const [phase, setPhase] = useState<"buttons" | "tapping" | "response">("buttons");
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clearAll = () => timeoutsRef.current.forEach(clearTimeout);

    const runAnimation = () => {
      clearAll();
      timeoutsRef.current = [];
      setPhase("buttons");
      setTappedIndex(null);
      setVisibleSteps(0);

      timeoutsRef.current.push(setTimeout(() => { setTappedIndex(4); setPhase("tapping"); }, 2000));
      timeoutsRef.current.push(setTimeout(() => { setPhase("response"); }, 2800));

      emergencyResponse.steps.forEach((_, i) => {
        timeoutsRef.current.push(setTimeout(() => { setVisibleSteps(i + 1); }, 3500 + i * 600));
      });

      const totalTime = 3500 + emergencyResponse.steps.length * 600 + LOOP_RESTART;
      timeoutsRef.current.push(setTimeout(runAnimation, totalTime));
    };

    runAnimation();
    return clearAll;
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      requestAnimationFrame(() => {
        if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
      });
    }
  }, [visibleSteps, phase]);

  return (
    <section className="px-4 py-16 md:py-20 bg-background">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              <span className="text-destructive">{t("emergency.title.1")}</span>{t("emergency.title.2")}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg mx-auto">
              {t("emergency.desc")}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <ScrollReveal>
            <div className="flex justify-center">
              <div className="relative mx-auto w-72 md:w-80">
                <div className="rounded-[2.5rem] border-[6px] border-foreground/20 bg-background shadow-2xl shadow-destructive/10 overflow-hidden">
                  <div className="bg-destructive/5 px-5 pt-2 pb-1 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-medium">03:12</span>
                    <div className="flex gap-1">
                      <div className="w-3.5 h-2 rounded-sm bg-muted-foreground/40" />
                      <div className="w-1.5 h-2 rounded-sm bg-muted-foreground/30" />
                    </div>
                  </div>
                  <div className="bg-destructive/5 px-4 pb-3 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-destructive/15 flex items-center justify-center">
                        <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground leading-tight">{t("emergency.header")}</p>
                        <p className="text-[10px] text-destructive font-medium">{t("emergency.quickHelp")}</p>
                      </div>
                    </div>
                  </div>
                  <div ref={containerRef} className="h-80 overflow-hidden px-3 py-3 bg-background">
                    {phase === "buttons" || phase === "tapping" ? (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground text-center mb-3">{t("emergency.whatsHappening")}</p>
                        {emergencyButtons.map((btn, i) => (
                          <button key={i} className={cn("w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-300", tappedIndex === i ? "border-primary bg-primary/10 scale-[0.97]" : "border-border/40 bg-card", phase === "buttons" && "animate-fade-in")} style={{ animationDelay: `${i * 80}ms` }}>
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", btn.color)}>
                              <btn.icon className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-semibold text-foreground">{btn.label}</p>
                              <p className="text-[10px] text-muted-foreground">{btn.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3 animate-fade-in">
                        <div className="text-center">
                          <p className="text-sm font-bold text-foreground">{emergencyResponse.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{t("emergency.followSteps")}</p>
                        </div>
                        <div className="space-y-2">
                          {emergencyResponse.steps.slice(0, visibleSteps).map((step, i) => (
                            <div key={i} className="flex items-start gap-2.5 animate-fade-in bg-muted/50 rounded-xl p-2.5">
                              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-[10px] font-bold text-primary-foreground">{i + 1}</span>
                              </div>
                              <p className="text-xs text-foreground leading-relaxed">{step}</p>
                            </div>
                          ))}
                        </div>
                        {visibleSteps >= emergencyResponse.steps.length && (
                          <div className="bg-primary/10 rounded-xl p-3 animate-fade-in">
                            <p className="text-xs text-foreground leading-relaxed">{emergencyResponse.tip}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="bg-background flex justify-center py-2 border-t border-border/20">
                    <div className="w-24 h-1 rounded-full bg-foreground/20" />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0"><span className="text-lg">⚡</span></div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{t("emergency.feat1.title")}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-1">{t("emergency.feat1.desc")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><span className="text-lg">🌙</span></div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{t("emergency.feat2.title")}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-1">{t("emergency.feat2.desc")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0"><span className="text-lg">🧠</span></div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{t("emergency.feat3.title")}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-1">{t("emergency.feat3.desc")}</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
