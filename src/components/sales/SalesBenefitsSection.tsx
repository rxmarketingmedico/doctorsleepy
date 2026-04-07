import { Check } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { useSalesT } from "@/contexts/SalesLanguageContext";

export default function SalesBenefitsSection() {
  const { t } = useSalesT();
  const benefits = [t("benefits.1"), t("benefits.2"), t("benefits.3"), t("benefits.4"), t("benefits.5")];

  return (
    <section className="px-4 py-16 md:py-20 bg-muted/30">
      <div className="max-w-2xl mx-auto text-center">
        <ScrollReveal><h2 className="text-2xl md:text-3xl font-bold mb-10 text-foreground">{t("benefits.title")}</h2></ScrollReveal>
        <div className="space-y-4">
          {benefits.map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-card rounded-2xl p-4 border border-border/40 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-secondary/60 flex items-center justify-center shrink-0"><Check className="w-3.5 h-3.5 text-secondary-foreground" /></div>
              <p className="text-foreground text-sm md:text-base text-left">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
