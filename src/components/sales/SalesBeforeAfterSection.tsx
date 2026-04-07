import { X, Check } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { useSalesT } from "@/contexts/SalesLanguageContext";

export default function SalesBeforeAfterSection() {
  const { t } = useSalesT();
  const beforeItems = [t("ba.before1"), t("ba.before2"), t("ba.before3"), t("ba.before4"), t("ba.before5")];
  const afterItems = [t("ba.after1"), t("ba.after2"), t("ba.after3"), t("ba.after4"), t("ba.after5")];

  return (
    <section className="px-4 py-16 md:py-20">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">{t("ba.title")}</h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ScrollReveal delay={0}>
            <div className="bg-card rounded-2xl border border-destructive/20 p-6 h-full">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center"><X className="w-4 h-4 text-destructive" /></div>
                <h3 className="font-bold text-foreground">{t("ba.without")}</h3>
              </div>
              <div className="space-y-3">
                {beforeItems.map((item, i) => (<div key={i} className="flex items-start gap-2.5"><X className="w-4 h-4 text-destructive/60 shrink-0 mt-0.5" /><p className="text-muted-foreground text-sm">{item}</p></div>))}
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="bg-card rounded-2xl border border-primary/20 p-6 h-full ring-1 ring-primary/10 shadow-lg shadow-primary/5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><Check className="w-4 h-4 text-primary" /></div>
                <h3 className="font-bold text-foreground">{t("ba.with")}</h3>
              </div>
              <div className="space-y-3">
                {afterItems.map((item, i) => (<div key={i} className="flex items-start gap-2.5"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /><p className="text-foreground text-sm">{item}</p></div>))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
