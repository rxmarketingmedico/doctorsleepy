import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useSalesT } from "@/contexts/SalesLanguageContext";
import doctorAvatar from "@/assets/doctor-avatar.png";
import {
  MessageSquare, Mic, Moon, AlertTriangle, Baby, Clock,
  Home, BookOpen, Music, ArrowRight, Square, Check
} from "lucide-react";

type Screen = "home" | "chat" | "cry" | "cta";

const SCREEN_DURATIONS: Record<Screen, number> = {
  home: 4000,
  chat: 7000,
  cry: 7000,
  cta: 5000,
};

const SCREENS: Screen[] = ["home", "chat", "cry", "cta"];

export default function HeroDemoMockup() {
  const { t } = useSalesT();
  const [currentScreen, setCurrentScreen] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  // Chat state
  const [chatMessages, setChatMessages] = useState(0);
  const [chatTyping, setChatTyping] = useState<"parent" | "doctor" | null>(null);

  // Cry state
  const [cryPhase, setCryPhase] = useState<"idle" | "recording" | "analyzing" | "result">("idle");
  const [cryBars, setCryBars] = useState(0);

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const screen = SCREENS[currentScreen];

  // Screen-specific animations
  useEffect(() => {
    clearTimeouts();
    setFadeKey((k) => k + 1);

    if (screen === "chat") {
      setChatMessages(0);
      setChatTyping(null);
      const msgs = [
        { role: "parent" as const, delay: 500 },
        { role: "doctor" as const, delay: 2000 },
        { role: "parent" as const, delay: 4000 },
        { role: "doctor" as const, delay: 5500 },
      ];
      msgs.forEach((m, i) => {
        timeoutsRef.current.push(setTimeout(() => setChatTyping(m.role), m.delay));
        timeoutsRef.current.push(setTimeout(() => {
          setChatTyping(null);
          setChatMessages(i + 1);
        }, m.delay + 800));
      });
    }

    if (screen === "cry") {
      setCryPhase("idle");
      setCryBars(0);
      timeoutsRef.current.push(setTimeout(() => setCryPhase("recording"), 800));
      timeoutsRef.current.push(setTimeout(() => setCryPhase("analyzing"), 3000));
      timeoutsRef.current.push(setTimeout(() => {
        setCryPhase("result");
        for (let i = 0; i < 4; i++) {
          timeoutsRef.current.push(setTimeout(() => setCryBars(i + 1), i * 250));
        }
      }, 4500));
    }

    return clearTimeouts;
  }, [currentScreen]);

  // Auto-advance screens
  useEffect(() => {
    const duration = SCREEN_DURATIONS[screen];
    const timer = setTimeout(() => {
      setCurrentScreen((prev) => (prev + 1) % SCREENS.length);
    }, duration);
    return () => clearTimeout(timer);
  }, [currentScreen, screen]);

  const screenInfo = {
    home: { label: t("demo.home.label"), desc: t("demo.home.desc"), icon: Home },
    chat: { label: t("demo.chat.label"), desc: t("demo.chat.desc"), icon: MessageSquare },
    cry: { label: t("demo.cry.label"), desc: t("demo.cry.desc"), icon: Mic },
    cta: { label: t("demo.cta.label"), desc: t("demo.cta.desc"), icon: Moon },
  };

  const info = screenInfo[screen];

  const chatConvo = [
    { role: "parent", text: t("demo.chat.msg1") },
    { role: "doctor", text: t("demo.chat.msg2") },
    { role: "parent", text: t("demo.chat.msg3") },
    { role: "doctor", text: t("demo.chat.msg4") },
  ];

  const cryCategories = [
    { label: t("cry.hunger"), value: 72, color: "bg-amber-500" },
    { label: t("cry.sleepiness"), value: 15, color: "bg-blue-500" },
    { label: t("cry.colic"), value: 8, color: "bg-orange-500" },
    { label: t("cry.discomfort"), value: 3, color: "bg-rose-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-center max-w-2xl mx-auto">
      {/* Phone mockup */}
      <div className="flex justify-center">
        <div className="relative mx-auto w-64 md:w-72">
          <div className="rounded-[2.5rem] border-[6px] border-foreground/20 bg-background shadow-2xl shadow-primary/10 overflow-hidden">
            {/* Status bar */}
            <div className="bg-primary/10 px-5 pt-2 pb-1 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground font-medium">21:47</span>
              <div className="flex gap-1">
                <div className="w-3.5 h-2 rounded-sm bg-muted-foreground/40" />
                <div className="w-1.5 h-2 rounded-sm bg-muted-foreground/30" />
              </div>
            </div>

            {/* Screen content */}
            <div key={fadeKey} className="h-[340px] overflow-hidden bg-background animate-fade-in">
              {screen === "home" && <HomeScreen t={t} />}
              {screen === "chat" && (
                <ChatScreen
                  t={t}
                  messages={chatMessages}
                  typing={chatTyping}
                  convo={chatConvo}
                  doctorAvatar={doctorAvatar}
                />
              )}
              {screen === "cry" && (
                <CryScreen
                  t={t}
                  phase={cryPhase}
                  bars={cryBars}
                  categories={cryCategories}
                />
              )}
              {screen === "cta" && <CTAScreen t={t} />}
            </div>

            {/* Home indicator */}
            <div className="bg-background flex justify-center py-2">
              <div className="w-24 h-1 rounded-full bg-foreground/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Info panel */}
      <div className="text-center md:text-left space-y-4">
        <div key={fadeKey} className="animate-fade-in space-y-3">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1.5 text-xs font-medium text-primary">
            <info.icon className="w-3.5 h-3.5" />
            {info.label}
          </div>
          <p className="text-sm md:text-base text-foreground/80 leading-relaxed max-w-xs mx-auto md:mx-0">
            {info.desc}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center md:justify-start gap-2 pt-2">
          {SCREENS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentScreen(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === currentScreen ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-screens ─── */

function HomeScreen({ t }: { t: (k: string) => string }) {
  const features = [
    { icon: MessageSquare, label: t("solution.chat"), color: "bg-primary/15 text-primary" },
    { icon: Mic, label: t("solution.cry"), color: "bg-amber-500/15 text-amber-600" },
    { icon: Clock, label: t("solution.routine"), color: "bg-blue-500/15 text-blue-600" },
    { icon: AlertTriangle, label: t("solution.emergency"), color: "bg-destructive/15 text-destructive" },
    { icon: BookOpen, label: t("solution.library"), color: "bg-emerald-500/15 text-emerald-600" },
    { icon: Music, label: t("demo.home.audio"), color: "bg-purple-500/15 text-purple-600" },
  ];

  return (
    <div className="px-4 py-4 space-y-3">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
          <Moon className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-xs font-bold text-foreground">Dr. Sleepy</p>
          <p className="text-[9px] text-muted-foreground">{t("demo.home.greeting")}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {features.map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-border/40 bg-card animate-fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", f.color)}>
              <f.icon className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-semibold text-foreground leading-tight">{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatScreen({
  t, messages, typing, convo, doctorAvatar,
}: {
  t: (k: string) => string;
  messages: number;
  typing: "parent" | "doctor" | null;
  convo: { role: string; text: string }[];
  doctorAvatar: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    requestAnimationFrame(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; });
  }, [messages, typing]);

  return (
    <div className="flex flex-col h-full">
      <div className="bg-primary/10 px-3 py-2 flex items-center gap-2 border-b border-border/40">
        <div className="w-7 h-7 rounded-full overflow-hidden border border-primary/30">
          <img src={doctorAvatar} alt="Dr. Sleepy" className="w-full h-full object-cover" width={28} height={28} />
        </div>
        <div>
          <p className="text-xs font-bold text-foreground leading-tight">Dr. Sleepy</p>
          <p className="text-[9px] text-primary font-medium">{t("chat.onlineNow")}</p>
        </div>
      </div>
      <div ref={ref} className="flex-1 overflow-hidden px-2.5 py-2 space-y-2">
        {convo.slice(0, messages).map((msg, i) => (
          <div key={i} className={cn("flex animate-fade-in", msg.role === "parent" ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[85%] px-2.5 py-1.5 text-[10px] leading-relaxed shadow-sm", msg.role === "parent" ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md" : "bg-muted text-foreground rounded-2xl rounded-bl-md")}>
              {msg.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className={cn("flex animate-fade-in", typing === "parent" ? "justify-end" : "justify-start")}>
            <div className={cn("px-3 py-2 rounded-2xl shadow-sm", typing === "parent" ? "bg-primary/80 rounded-br-md" : "bg-muted rounded-bl-md")}>
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CryScreen({
  t, phase, bars, categories,
}: {
  t: (k: string) => string;
  phase: string;
  bars: number;
  categories: { label: string; value: number; color: string }[];
}) {
  return (
    <div className="px-3 py-3 h-full">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/40">
        <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center">
          <Mic className="w-3 h-3 text-primary" />
        </div>
        <div>
          <p className="text-xs font-bold text-foreground leading-tight">{t("cry.header")}</p>
          <p className="text-[9px] text-primary font-medium">{t("cry.aiAnalysis")}</p>
        </div>
      </div>

      {(phase === "idle" || phase === "recording") && (
        <div className="flex flex-col items-center justify-center h-52 gap-3 animate-fade-in">
          <p className="text-[10px] text-muted-foreground">
            {phase === "idle" ? t("cry.pressToRecord") : t("cry.recording") + " 0:02"}
          </p>
          <div className={cn("w-16 h-16 rounded-full flex items-center justify-center transition-all", phase === "recording" ? "bg-destructive animate-pulse" : "bg-primary")}>
            {phase === "recording" ? <Square className="w-6 h-6 text-primary-foreground" /> : <Mic className="w-6 h-6 text-primary-foreground" />}
          </div>
          {phase === "recording" && (
            <div className="flex gap-0.5 items-end h-5">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-1 bg-primary/60 rounded-full animate-pulse" style={{ height: `${Math.random() * 16 + 4}px`, animationDelay: `${i * 50}ms` }} />
              ))}
            </div>
          )}
        </div>
      )}

      {phase === "analyzing" && (
        <div className="flex flex-col items-center justify-center h-52 gap-3 animate-fade-in">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-primary" />
          <p className="text-[10px] text-muted-foreground">{t("cry.analyzingAI")}</p>
        </div>
      )}

      {phase === "result" && (
        <div className="space-y-2.5 animate-fade-in">
          <div className="text-center bg-primary/5 rounded-xl p-2">
            <p className="text-[9px] text-muted-foreground">{t("cry.mostLikely")}</p>
            <p className="text-sm font-bold text-primary">{t("cry.hunger")}</p>
          </div>
          <div className="space-y-1.5">
            {categories.slice(0, bars).map((cat, i) => (
              <div key={i} className="animate-fade-in">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[9px] font-medium text-foreground">{cat.label}</span>
                  <span className="text-[9px] text-muted-foreground">{cat.value}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-700", cat.color)} style={{ width: `${cat.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-1.5 mt-1">
            <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-[9px] text-foreground leading-relaxed">{t("cry.tip1")}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function CTAScreen({ t }: { t: (k: string) => string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-5 text-center space-y-4">
      <Moon className="w-10 h-10 text-primary" />
      <div className="space-y-2">
        <h3 className="text-base font-extrabold text-foreground leading-tight">
          {t("demo.cta.title")}
        </h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {t("demo.cta.pricing")}
        </p>
      </div>
      <button
        onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
        className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-5 py-2 rounded-full text-xs font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
      >
        {t("demo.cta.button")}
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
