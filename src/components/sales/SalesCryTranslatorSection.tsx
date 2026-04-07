import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Mic, Square, Check } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { useSalesT } from "@/contexts/SalesLanguageContext";

type Phase = "idle" | "recording" | "selecting" | "analyzing" | "result";

const PHASE_TIMINGS: Record<Phase, number> = {
  idle: 1500, recording: 3000, selecting: 2000, analyzing: 2000, result: 5000,
};

export default function SalesCryTranslatorSection() {
  const { t } = useSalesT();

  const categoryData = [
    { label: t("cry.hunger"), value: 72, color: "bg-amber-500" },
    { label: t("cry.sleepiness"), value: 15, color: "bg-blue-500" },
    { label: t("cry.colic"), value: 8, color: "bg-orange-500" },
    { label: t("cry.discomfort"), value: 3, color: "bg-rose-500" },
    { label: t("cry.emotional"), value: 2, color: "bg-purple-500" },
  ];

  const soothingTips = [t("cry.tip1"), t("cry.tip2"), t("cry.tip3")];

  const characteristics = [
    { label: t("cry.intensity"), value: t("cry.high") },
    { label: t("cry.pattern"), value: t("cry.rhythmic") },
    { label: t("cry.tone"), value: t("cry.medium") },
  ];

  const [phase, setPhase] = useState<Phase>("idle");
  const [recordTime, setRecordTime] = useState(0);
  const [selectedChars, setSelectedChars] = useState(0);
  const [visibleBars, setVisibleBars] = useState(0);
  const [visibleTips, setVisibleTips] = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clearAll = () => { timeoutsRef.current.forEach(clearTimeout); intervalsRef.current.forEach(clearInterval); };

    const runAnimation = () => {
      clearAll();
      timeoutsRef.current = [];
      intervalsRef.current = [];
      setPhase("idle"); setRecordTime(0); setSelectedChars(0); setVisibleBars(0); setVisibleTips(0);

      let elapsed = PHASE_TIMINGS.idle;
      timeoutsRef.current.push(setTimeout(() => {
        setPhase("recording");
        const interval = setInterval(() => setRecordTime((p) => p + 1), 1000);
        intervalsRef.current.push(interval);
      }, elapsed));

      elapsed += PHASE_TIMINGS.recording;
      timeoutsRef.current.push(setTimeout(() => {
        intervalsRef.current.forEach(clearInterval);
        setPhase("selecting");
        for (let i = 0; i < 3; i++) timeoutsRef.current.push(setTimeout(() => setSelectedChars(i + 1), i * 500));
      }, elapsed));

      elapsed += PHASE_TIMINGS.selecting;
      timeoutsRef.current.push(setTimeout(() => setPhase("analyzing"), elapsed));

      elapsed += PHASE_TIMINGS.analyzing;
      timeoutsRef.current.push(setTimeout(() => {
        setPhase("result");
        categoryData.forEach((_, i) => timeoutsRef.current.push(setTimeout(() => setVisibleBars(i + 1), i * 300)));
        soothingTips.forEach((_, i) => timeoutsRef.current.push(setTimeout(() => setVisibleTips(i + 1), categoryData.length * 300 + i * 400)));
      }, elapsed));

      elapsed += PHASE_TIMINGS.result;
      timeoutsRef.current.push(setTimeout(runAnimation, elapsed));
    };

    runAnimation();
    return clearAll;
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => { if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight; });
  }, [visibleBars, visibleTips, phase]);

  return (
    <section className="px-4 py-16 md:py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              <span className="text-primary">{t("cry.title.1")}</span>{t("cry.title.2")}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg mx-auto">{t("cry.desc")}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <ScrollReveal>
            <div className="space-y-6 order-2 md:order-1">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><span className="text-lg">🎙️</span></div>
                <div><h3 className="font-bold text-foreground text-sm">{t("cry.feat1.title")}</h3><p className="text-muted-foreground text-xs leading-relaxed mt-1">{t("cry.feat1.desc")}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><span className="text-lg">📋</span></div>
                <div><h3 className="font-bold text-foreground text-sm">{t("cry.feat2.title")}</h3><p className="text-muted-foreground text-xs leading-relaxed mt-1">{t("cry.feat2.desc")}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><span className="text-lg">🧠</span></div>
                <div><h3 className="font-bold text-foreground text-sm">{t("cry.feat3.title")}</h3><p className="text-muted-foreground text-xs leading-relaxed mt-1">{t("cry.feat3.desc")}</p></div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="flex justify-center order-1 md:order-2">
              <div className="relative mx-auto w-72 md:w-80">
                <div className="rounded-[2.5rem] border-[6px] border-foreground/20 bg-background shadow-2xl shadow-primary/10 overflow-hidden">
                  <div className="bg-primary/5 px-5 pt-2 pb-1 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-medium">14:32</span>
                    <div className="flex gap-1"><div className="w-3.5 h-2 rounded-sm bg-muted-foreground/40" /><div className="w-1.5 h-2 rounded-sm bg-muted-foreground/30" /></div>
                  </div>
                  <div className="bg-primary/5 px-4 pb-3 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center"><Mic className="w-3.5 h-3.5 text-primary" /></div>
                      <div><p className="text-sm font-bold text-foreground leading-tight">{t("cry.header")}</p><p className="text-[10px] text-primary font-medium">{t("cry.aiAnalysis")}</p></div>
                    </div>
                  </div>

                  <div ref={containerRef} className="h-80 overflow-hidden px-3 py-3 bg-background">
                    {(phase === "idle" || phase === "recording") && (
                      <div className="flex flex-col items-center justify-center h-full gap-4 animate-fade-in">
                        <p className="text-xs text-muted-foreground">{phase === "idle" ? t("cry.pressToRecord") : `${t("cry.recording")} 0:0${recordTime}`}</p>
                        <div className={cn("w-20 h-20 rounded-full flex items-center justify-center transition-all", phase === "recording" ? "bg-destructive animate-pulse" : "bg-primary")}>
                          {phase === "recording" ? <Square className="w-8 h-8 text-primary-foreground" /> : <Mic className="w-8 h-8 text-primary-foreground" />}
                        </div>
                        {phase === "recording" && (
                          <div className="flex gap-0.5 items-end h-6">
                            {Array.from({ length: 20 }).map((_, i) => (<div key={i} className="w-1 bg-primary/60 rounded-full animate-pulse" style={{ height: `${Math.random() * 20 + 4}px`, animationDelay: `${i * 50}ms` }} />))}
                          </div>
                        )}
                      </div>
                    )}
                    {phase === "selecting" && (
                      <div className="space-y-3 animate-fade-in">
                        <p className="text-xs text-muted-foreground text-center mb-2">{t("cry.describeTheCry")}</p>
                        {characteristics.map((c, i) => (
                          <div key={i} className={cn("flex items-center justify-between p-2.5 rounded-xl border transition-all duration-300", i < selectedChars ? "border-primary bg-primary/10" : "border-border/40 bg-card")}>
                            <span className="text-xs font-medium text-foreground">{c.label}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-primary font-semibold">{c.value}</span>
                              {i < selectedChars && <Check className="w-3.5 h-3.5 text-primary" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {phase === "analyzing" && (
                      <div className="flex flex-col items-center justify-center h-full gap-3 animate-fade-in">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        <p className="text-xs text-muted-foreground">{t("cry.analyzingAI")}</p>
                      </div>
                    )}
                    {phase === "result" && (
                      <div className="space-y-3 animate-fade-in">
                        <div className="text-center bg-primary/5 rounded-xl p-2.5">
                          <p className="text-[10px] text-muted-foreground">{t("cry.mostLikely")}</p>
                          <p className="text-sm font-bold text-primary">{t("cry.hunger")}</p>
                        </div>
                        <div className="space-y-1.5">
                          {categoryData.slice(0, visibleBars).map((cat, i) => (
                            <div key={i} className="animate-fade-in">
                              <div className="flex justify-between items-center mb-0.5">
                                <span className="text-[10px] font-medium text-foreground">{cat.label}</span>
                                <span className="text-[10px] text-muted-foreground">{cat.value}%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className={cn("h-full rounded-full transition-all duration-700", cat.color)} style={{ width: `${cat.value}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                        {visibleTips > 0 && (
                          <div className="space-y-1.5 mt-2">
                            <p className="text-[10px] font-semibold text-foreground">{t("cry.tips")}</p>
                            {soothingTips.slice(0, visibleTips).map((tip, i) => (
                              <div key={i} className="flex items-start gap-1.5 animate-fade-in">
                                <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                                <p className="text-[10px] text-foreground leading-relaxed">{tip}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="bg-background flex justify-center py-2 border-t border-border/20"><div className="w-24 h-1 rounded-full bg-foreground/20" /></div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
