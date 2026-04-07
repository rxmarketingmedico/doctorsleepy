import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSalesT } from "@/contexts/SalesLanguageContext";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/60 rounded-2xl overflow-hidden transition-all">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors">
        <span className="font-semibold text-foreground text-sm md:text-base pr-4">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />}
      </button>
      {open && (<div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed animate-fade-in">{a}</div>)}
    </div>
  );
}

export default function SalesFAQSection() {
  const { t } = useSalesT();
  const faqs = [
    { q: t("faq.1.q"), a: t("faq.1.a") },
    { q: t("faq.2.q"), a: t("faq.2.a") },
    { q: t("faq.3.q"), a: t("faq.3.a") },
    { q: t("faq.4.q"), a: t("faq.4.a") },
    { q: t("faq.5.q"), a: t("faq.5.a") },
    { q: t("faq.6.q"), a: t("faq.6.a") },
  ];

  return (
    <section className="px-4 py-16 md:py-20">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">{t("faq.title")}</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (<FAQItem key={i} q={faq.q} a={faq.a} />))}
        </div>
      </div>
    </section>
  );
}
