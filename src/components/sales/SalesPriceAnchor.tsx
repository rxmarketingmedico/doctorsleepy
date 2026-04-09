import { useSalesT } from "@/contexts/SalesLanguageContext";
import { ScrollReveal } from "@/hooks/useScrollReveal";

export default function SalesPriceAnchor() {
  const { t } = useSalesT();

  return (
    <section className="px-4 py-12 md:py-16">
      <div className="max-w-2xl mx-auto text-center">
        <ScrollReveal>
          <p className="text-lg md:text-2xl font-bold text-foreground leading-relaxed">
            {t("priceAnchor.line1")}{" "}
            <span className="text-primary">{t("priceAnchor.highlight")}</span>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
