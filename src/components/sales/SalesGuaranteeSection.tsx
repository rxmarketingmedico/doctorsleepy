import { ShieldCheck, RefreshCw, Heart } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { useSalesT } from "@/contexts/SalesLanguageContext";

export default function SalesGuaranteeSection() {
  const { t } = useSalesT();
  return (
    <section className="px-4 py-16 md:py-20 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"><ShieldCheck className="w-8 h-8 text-primary" /></div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{t("guarantee.title")}</h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">{t("guarantee.desc")}</p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <div className="bg-card rounded-2xl border border-primary/20 p-6 md:p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center md:text-left flex flex-col items-center md:items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><RefreshCw className="w-5 h-5 text-primary" /></div>
                <div><h3 className="font-bold text-foreground text-sm mb-1">{t("guarantee.refund.title")}</h3><p className="text-muted-foreground text-xs leading-relaxed">{t("guarantee.refund.desc")}</p></div>
              </div>
              <div className="text-center md:text-left flex flex-col items-center md:items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-primary" /></div>
                <div><h3 className="font-bold text-foreground text-sm mb-1">{t("guarantee.noRedTape.title")}</h3><p className="text-muted-foreground text-xs leading-relaxed">{t("guarantee.noRedTape.desc")}</p></div>
              </div>
              <div className="text-center md:text-left flex flex-col items-center md:items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><Heart className="w-5 h-5 text-primary" /></div>
                <div><h3 className="font-bold text-foreground text-sm mb-1">{t("guarantee.zeroRisk.title")}</h3><p className="text-muted-foreground text-xs leading-relaxed">{t("guarantee.zeroRisk.desc")}</p></div>
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-border/40 text-center">
              <p className="text-muted-foreground text-xs leading-relaxed italic">{t("guarantee.quote")}</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
