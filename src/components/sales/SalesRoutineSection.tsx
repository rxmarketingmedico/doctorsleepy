import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Moon, Sun, Baby, Droplets, Sparkles, TrendingUp } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const routineEntries = [
  { type: "sleep", label: "Night sleep", time: "20:30", end: "06:15", icon: Moon, color: "bg-indigo-500/15 text-indigo-600" },
  { type: "feeding", label: "Feeding", time: "06:20", end: null, icon: Baby, color: "bg-pink-500/15 text-pink-600" },
  { type: "nap", label: "Nap", time: "09:00", end: "10:30", icon: Sun, color: "bg-amber-500/15 text-amber-600" },
  { type: "diaper", label: "Diaper change", time: "10:35", end: null, icon: Droplets, color: "bg-cyan-500/15 text-cyan-600" },
  { type: "feeding", label: "Feeding", time: "11:00", end: null, icon: Baby, color: "bg-pink-500/15 text-pink-600" },
];

const aiInsight = "📊 Pattern detected: Your baby sleeps better when the last nap ends before 4pm. Consider moving the afternoon routine 30 minutes earlier.";

const LOOP_RESTART = 4000;

export default function SalesRoutineSection() {
  const [visibleEntries, setVisibleEntries] = useState(0);
  const [showInsight, setShowInsight] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clearAll = () => timeoutsRef.current.forEach(clearTimeout);

    const runAnimation = () => {
      clearAll();
      timeoutsRef.current = [];
      setVisibleEntries(0);
      setShowInsight(false);

      routineEntries.forEach((_, i) => {
        timeoutsRef.current.push(setTimeout(() => {
          setVisibleEntries(i + 1);
        }, 800 + i * 700));
      });

      const insightDelay = 800 + routineEntries.length * 700 + 600;
      timeoutsRef.current.push(setTimeout(() => {
        setShowInsight(true);
      }, insightDelay));

      const totalTime = insightDelay + LOOP_RESTART;
      timeoutsRef.current.push(setTimeout(runAnimation, totalTime));
    };

    runAnimation();
    return clearAll;
  }, []);

  return (
    <section className="px-4 py-16 md:py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              <span className="text-primary">Smart Routine</span> — the app learns with you
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg mx-auto">
              Log sleep, feedings and diaper changes with one tap. Dr. Sleepy analyzes the patterns
              and gives you increasingly precise guidance.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Phone mockup */}
          <ScrollReveal>
            <div className="flex justify-center">
              <div className="relative mx-auto w-72 md:w-80">
                <div className="rounded-[2.5rem] border-[6px] border-foreground/20 bg-background shadow-2xl shadow-primary/10 overflow-hidden">
                  {/* Status bar */}
                  <div className="bg-primary/5 px-5 pt-2 pb-1 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-medium">09:45</span>
                    <div className="flex gap-1">
                      <div className="w-3.5 h-2 rounded-sm bg-muted-foreground/40" />
                      <div className="w-1.5 h-2 rounded-sm bg-muted-foreground/30" />
                    </div>
                  </div>

                  {/* Header */}
                  <div className="bg-primary/5 px-4 pb-3 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                        <TrendingUp className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground leading-tight">Baby Routine</p>
                        <p className="text-[10px] text-primary font-medium">Today — 5 entries</p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="h-80 overflow-hidden px-3 py-3 bg-background">
                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-muted/50 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-muted-foreground">Sleep</p>
                        <p className="text-sm font-bold text-foreground">9h 45min</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-muted-foreground">Feedings</p>
                        <p className="text-sm font-bold text-foreground">2</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-muted-foreground">Diapers</p>
                        <p className="text-sm font-bold text-foreground">1</p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-2">
                      {routineEntries.slice(0, visibleEntries).map((entry, i) => {
                        const Icon = entry.icon;
                        return (
                          <div
                            key={i}
                            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50 animate-fade-in"
                          >
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", entry.color)}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-foreground">{entry.label}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {entry.time}{entry.end && ` - ${entry.end}`}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* AI Insight */}
                    {showInsight && (
                      <div className="mt-3 bg-primary/10 rounded-xl p-2.5 animate-fade-in border border-primary/20">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Sparkles className="w-3 h-3 text-primary" />
                          <p className="text-[10px] font-bold text-primary">Dr. Sleepy Insight</p>
                        </div>
                        <p className="text-[10px] text-foreground leading-relaxed">{aiInsight}</p>
                      </div>
                    )}
                  </div>

                  {/* Home indicator */}
                  <div className="bg-background flex justify-center py-2 border-t border-border/20">
                    <div className="w-24 h-1 rounded-full bg-foreground/20" />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Text content */}
          <ScrollReveal>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📱</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">Log in 1 tap</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-1">
                      Sleep, feeding, diaper change — all logged in seconds, even at 3am with one hand.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📊</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">Patterns revealed</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-1">
                      Dr. Sleepy analyzes the last 7 days and identifies patterns you wouldn't spot on your own.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🧠</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">AI that learns with you</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-1">
                      The more you log, the smarter Dr. Sleepy gets. Every tip is based on your baby's real routine.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🌙</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">Gradually improve sleep</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-1">
                      With real data, Dr. Sleepy suggests small, practical adjustments to the routine for better nights.
                    </p>
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
