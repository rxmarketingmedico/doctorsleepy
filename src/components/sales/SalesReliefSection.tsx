import { Shield } from "lucide-react";
import peacefulImg from "@/assets/sales/peaceful-parent.webp";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { useSalesT } from "@/contexts/SalesLanguageContext";

export default function SalesReliefSection() {
  const { t } = useSalesT();
  return (
    <section className="px-4 py-16 md:py-20">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/10">
              <img src={peacefulImg} alt="Smiling mom with baby sleeping in her arms" className="w-full h-auto object-cover aspect-square" loading="lazy" decoding="async" width={600} height={600} />
          </div>
          <div className="text-center md:text-left">
            <div className="w-14 h-14 rounded-full bg-secondary/60 flex items-center justify-center mx-auto md:mx-0 mb-6">
              <Shield className="w-7 h-7 text-secondary-foreground" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              {t("relief.title")}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              {t("relief.desc")}
            </p>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
