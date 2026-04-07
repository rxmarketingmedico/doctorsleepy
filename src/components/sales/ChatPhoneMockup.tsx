import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useSalesT } from "@/contexts/SalesLanguageContext";
import doctorAvatar from "@/assets/doctor-avatar.png";

interface ChatMessage {
  role: "parent" | "doctor";
  text: string;
  delay: number;
}

const TYPING_DURATION = 1200;
const RESTART_DELAY = 4000;

export function ChatPhoneMockup() {
  const { t } = useSalesT();

  const conversation: ChatMessage[] = [
    { role: "parent", text: t("chat.msg1"), delay: 0 },
    { role: "doctor", text: t("chat.msg2"), delay: 2000 },
    { role: "parent", text: t("chat.msg3"), delay: 4500 },
    { role: "doctor", text: t("chat.msg4"), delay: 6500 },
    { role: "parent", text: t("chat.msg5"), delay: 9500 },
    { role: "doctor", text: t("chat.msg6"), delay: 11000 },
  ];

  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<"parent" | "doctor" | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clearAll = () => timeoutsRef.current.forEach(clearTimeout);
    const runConversation = () => {
      clearAll(); timeoutsRef.current = []; setVisibleMessages(0); setIsTyping(null);
      conversation.forEach((msg, index) => {
        timeoutsRef.current.push(setTimeout(() => setIsTyping(msg.role), msg.delay));
        timeoutsRef.current.push(setTimeout(() => { setIsTyping(null); setVisibleMessages(index + 1); }, msg.delay + TYPING_DURATION));
      });
      const lastDelay = conversation[conversation.length - 1].delay + TYPING_DURATION;
      timeoutsRef.current.push(setTimeout(runConversation, lastDelay + RESTART_DELAY));
    };
    runConversation();
    return clearAll;
  }, []);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    requestAnimationFrame(() => { if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; });
  }, [visibleMessages, isTyping]);

  return (
    <div className="relative mx-auto w-72 md:w-80">
      <div className="rounded-[2.5rem] border-[6px] border-foreground/20 bg-background shadow-2xl shadow-primary/10 overflow-hidden">
        <div className="bg-primary/10 px-5 pt-2 pb-1 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground font-medium">21:47</span>
          <div className="flex gap-1"><div className="w-3.5 h-2 rounded-sm bg-muted-foreground/40" /><div className="w-1.5 h-2 rounded-sm bg-muted-foreground/30" /></div>
        </div>
        <div className="bg-primary/10 px-4 pb-3 flex items-center gap-3 border-b border-border/40">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">
            <img src={doctorAvatar} alt="Dr. Sleepy" className="w-full h-full object-cover" width={36} height={36} loading="lazy" decoding="async" />
          </div>
          <div><p className="text-sm font-bold text-foreground leading-tight">Dr. Sleepy</p><p className="text-[10px] text-primary font-medium">{t("chat.onlineNow")}</p></div>
        </div>
        <div ref={chatContainerRef} className="h-80 overflow-hidden px-3 py-3 space-y-2.5 bg-background">
          {conversation.slice(0, visibleMessages).map((msg, i) => (
            <div key={i} className={cn("flex animate-fade-in", msg.role === "parent" ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[85%] px-3 py-2 text-xs leading-relaxed shadow-sm", msg.role === "parent" ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md" : "bg-muted text-foreground rounded-2xl rounded-bl-md")}>{msg.text}</div>
            </div>
          ))}
          {isTyping && (
            <div className={cn("flex animate-fade-in", isTyping === "parent" ? "justify-end" : "justify-start")}>
              <div className={cn("px-4 py-2.5 rounded-2xl shadow-sm", isTyping === "parent" ? "bg-primary/80 rounded-br-md" : "bg-muted rounded-bl-md")}>
                <div className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="bg-muted/50 border-t border-border/40 px-3 py-2.5 flex items-center gap-2">
          <div className="flex-1 bg-background rounded-full px-3 py-1.5 text-[10px] text-muted-foreground border border-border/60">{t("chat.typeMessage")}</div>
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
          </div>
        </div>
        <div className="bg-background flex justify-center py-2"><div className="w-24 h-1 rounded-full bg-foreground/20" /></div>
      </div>
    </div>
  );
}
