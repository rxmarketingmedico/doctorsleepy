import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { useSalesT } from "@/contexts/SalesLanguageContext";

interface WaMessage {
  role: "user" | "contact";
  text: string;
  time: string;
  delay: number;
}

const TYPING_DURATION = 1000;
const RESTART_DELAY = 5000;

export default function SalesWhatsAppTestimonial() {
  const { t } = useSalesT();

  const conversation: WaMessage[] = [
    { role: "user", text: t("wa.msg1"), time: "14:32", delay: 0 },
    { role: "contact", text: t("wa.msg2"), time: "14:33", delay: 2000 },
    { role: "contact", text: t("wa.msg3"), time: "14:33", delay: 3500 },
    { role: "user", text: t("wa.msg4"), time: "14:34", delay: 5500 },
    { role: "contact", text: t("wa.msg5"), time: "14:34", delay: 7500 },
    { role: "contact", text: t("wa.msg6"), time: "14:35", delay: 10000 },
    { role: "user", text: t("wa.msg7"), time: "14:36", delay: 12500 },
    { role: "contact", text: t("wa.msg8"), time: "14:36", delay: 14500 },
  ];

  const [visibleMessages, setVisibleMessages] = useState(0);
  const [isTyping, setIsTyping] = useState<"user" | "contact" | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clearAll = () => timeoutsRef.current.forEach(clearTimeout);
    const run = () => {
      clearAll(); timeoutsRef.current = []; setVisibleMessages(0); setIsTyping(null);
      conversation.forEach((msg, i) => {
        const t1 = setTimeout(() => setIsTyping(msg.role), msg.delay);
        const t2 = setTimeout(() => { setIsTyping(null); setVisibleMessages(i + 1); }, msg.delay + TYPING_DURATION);
        timeoutsRef.current.push(t1, t2);
      });
      const last = conversation[conversation.length - 1].delay + TYPING_DURATION;
      timeoutsRef.current.push(setTimeout(run, last + RESTART_DELAY));
    };
    run();
    return clearAll;
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; });
  }, [visibleMessages, isTyping]);

  return (
    <section className="px-4 py-16 md:py-20 bg-background">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{t("wa.title")}</h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">{t("wa.subtitle")}</p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <div className="flex justify-center">
            <div className="relative w-80 md:w-[22rem]">
              <div className="rounded-[2.5rem] border-[6px] border-foreground/20 bg-[#0b141a] shadow-2xl shadow-primary/10 overflow-hidden">
                <div className="bg-[#1f2c34] px-5 pt-2 pb-1 flex items-center justify-between">
                  <span className="text-[10px] text-white/60 font-medium">21:12</span>
                  <div className="flex gap-1"><div className="w-3.5 h-2 rounded-sm bg-white/30" /><div className="w-1.5 h-2 rounded-sm bg-white/20" /></div>
                </div>
                <div className="bg-[#1f2c34] px-3 pb-3 flex items-center gap-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    <div className="w-9 h-9 rounded-full bg-[#2a3942] flex items-center justify-center text-white/80 text-sm font-bold">CR</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white leading-tight">{t("wa.contact")}</p>
                    <p className="text-[10px] text-white/50">online</p>
                  </div>
                  <div className="flex gap-4">
                    <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>
                    <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                  </div>
                </div>
                <div ref={chatRef} className="h-[22rem] overflow-hidden px-3 py-3 space-y-1.5" style={{ backgroundColor: "#0b141a" }}>
                  {conversation.slice(0, visibleMessages).map((msg, i) => (
                    <div key={i} className={cn("flex animate-fade-in", msg.role === "user" ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[82%] px-3 py-1.5 text-[13px] leading-relaxed relative", msg.role === "user" ? "bg-[#005c4b] text-white rounded-lg rounded-tr-sm" : "bg-[#1f2c34] text-white/90 rounded-lg rounded-tl-sm")}>
                        <span>{msg.text}</span>
                        <span className="inline-flex items-center gap-0.5 ml-2 float-right mt-1">
                          <span className="text-[10px] text-white/40">{msg.time}</span>
                          {msg.role === "user" && (<span className="flex -space-x-1"><Check className="w-3 h-3 text-[#53bdeb]" /><Check className="w-3 h-3 text-[#53bdeb]" /></span>)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className={cn("flex animate-fade-in", isTyping === "user" ? "justify-end" : "justify-start")}>
                      <div className={cn("px-4 py-2.5 rounded-lg", isTyping === "user" ? "bg-[#005c4b] rounded-tr-sm" : "bg-[#1f2c34] rounded-tl-sm")}>
                        <div className="flex gap-1 items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:0ms]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:150ms]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:300ms]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-[#1f2c34] px-2 py-2 flex items-center gap-2">
                  <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 text-[11px] text-white/40 flex items-center gap-2">
                    <svg className="w-4 h-4 text-white/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg>
                    Message
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#00a884] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 15 6.7 12H5c0 3.42 2.72 6.23 6 6.72V22h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" /></svg>
                  </div>
                </div>
                <div className="bg-[#0b141a] flex justify-center py-2"><div className="w-24 h-1 rounded-full bg-white/20" /></div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
