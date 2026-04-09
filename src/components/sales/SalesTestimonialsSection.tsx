import { Star, Users } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { useSalesT } from "@/contexts/SalesLanguageContext";
import camilaImg from "@/assets/sales/testimonial-camila.webp";
import lucasImg from "@/assets/sales/testimonial-lucas.webp";
import anaImg from "@/assets/sales/testimonial-ana.webp";

export default function SalesTestimonialsSection() {
  const { t } = useSalesT();

  const testimonials = [
    { name: t("testimonials.1.name"), role: t("testimonials.1.role"), text: t("testimonials.1.text"), stars: 5, avatar: camilaImg },
    { name: t("testimonials.2.name"), role: t("testimonials.2.role"), text: t("testimonials.2.text"), stars: 5, avatar: lucasImg },
    { name: t("testimonials.3.name"), role: t("testimonials.3.role"), text: t("testimonials.3.text"), stars: 5, avatar: anaImg },
  ];

  return (
    <section className="px-4 py-16 md:py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <Users className="w-4 h-4" />{t("testimonials.badge")}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t("testimonials.title")}</h2>
            {/* Rating summary */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <span className="font-bold text-foreground text-lg">{t("testimonials.rating")}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{t("testimonials.reviewCount")}</p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((tm, i) => (
            <ScrollReveal key={i} delay={i * 150}>
              <div className="bg-card rounded-2xl p-6 border border-border/40 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="flex gap-0.5 mb-3">{Array.from({ length: tm.stars }).map((_, j) => (<Star key={j} className="w-4 h-4 fill-primary text-primary" />))}</div>
                <p className="text-foreground text-sm leading-relaxed mb-4 flex-1">"{tm.text}"</p>
                <div className="border-t border-border/40 pt-3 flex items-center gap-3">
                  <img src={tm.avatar} alt={tm.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20" loading="lazy" decoding="async" width={40} height={40} />
                  <div><p className="font-semibold text-foreground text-sm">{tm.name}</p><p className="text-muted-foreground text-xs">{tm.role}</p></div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
