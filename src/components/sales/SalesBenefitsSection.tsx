import { Check } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const benefits = [
  "Fewer panicked nights, not knowing what to do",
  "More confidence in your decisions as a parent",
  "Immediate answers, no waiting for an appointment",
  "A calm companion in the hardest moments",
  "More sleep for you — and for your baby",
];

export default function SalesBenefitsSection() {
  return (
    <section className="px-4 py-16 md:py-20 bg-muted/30">
      <div className="max-w-2xl mx-auto text-center">
        <ScrollReveal>
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-foreground">
            What changes in your life
          </h2>
        </ScrollReveal>
        <div className="space-y-4">
          {benefits.map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-card rounded-2xl p-4 border border-border/40 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-secondary/60 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 text-secondary-foreground" />
              </div>
              <p className="text-foreground text-sm md:text-base text-left">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
