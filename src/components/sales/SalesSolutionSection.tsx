import { MessageCircle, Mic, BedDouble, BookOpen, Moon, Baby } from "lucide-react";
import { ChatPhoneMockup } from "./ChatPhoneMockup";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { useSalesT } from "@/contexts/SalesLanguageContext";

export default function SalesSolutionSection() {
  const { t } = useSalesT();

  const benefits = [
    { icon: MessageCircle, title: t("solution.chat"), desc: t("solution.chat.desc") },
    { icon: Mic, title: t("solution.cry"), desc: t("solution.cry.desc") },
    { icon: BedDouble, title: t("solution.routine"), desc: t("solution.routine.desc") },
    { icon: BookOpen, title: t("solution.library"), desc: t("solution.library.desc") },
    { icon: Moon, title: t("solution.night"), desc: t("solution.night.desc") },
    { icon: Baby, title: t("solution.emergency"), desc: t("solution.emergency.desc") },
  ];

  return (
    <section className="px-4 py-16 md:py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              {t("solution.title")}<span className="text-primary">{t("solution.title.highlight")}</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg mx-auto">
              {t("solution.desc")}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <ScrollReveal>
            <div className="flex justify-center">
              <ChatPhoneMockup />
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {benefits.map((b, i) => (
              <div key={i} className="bg-card rounded-2xl p-4 border border-border/40 shadow-sm text-left flex gap-3 items-start hover:shadow-md transition-shadow">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <b.icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm mb-0.5">{b.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
