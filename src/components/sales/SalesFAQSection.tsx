import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "Does Dr. Sleepy replace a pediatrician?",
    a: "No. Dr. Sleepy is an educational assistant that offers evidence-based guidance on infant sleep. It does not diagnose and does not replace medical care.",
  },
  {
    q: "What age range is it for?",
    a: "The app is designed for parents of babies aged 0 to 3 years. Guidance adapts to your baby's age.",
  },
  {
    q: "How does the Cry Translator work?",
    a: "You record your baby's cry and the AI analyzes sound patterns to suggest possible causes: hunger, sleep, discomfort, or pain. It's a support tool, not a diagnosis.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No hassle, no penalties. You can cancel directly through Hotmart at any time.",
  },
  {
    q: "Is the payment secure?",
    a: "Yes. Payment is processed by Hotmart, the largest digital products platform in Latin America, with state-of-the-art encryption.",
  },
  {
    q: "How do I access the app after paying?",
    a: "After payment, you create your account with the same email used for the purchase. Access is granted automatically.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/60 rounded-2xl overflow-hidden transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="font-semibold text-foreground text-sm md:text-base pr-4">{q}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed animate-fade-in">
          {a}
        </div>
      )}
    </div>
  );
}

export default function SalesFAQSection() {
  return (
    <section className="px-4 py-16 md:py-20">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
