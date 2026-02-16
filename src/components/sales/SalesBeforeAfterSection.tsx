import { X, Check } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const beforeItems = [
  "Sleepless nights with no idea why",
  "Google with contradictory answers",
  "Guilt for not being able to fix it",
  "Waiting days for an appointment",
  "Loneliness in the middle of the night",
];

const afterItems = [
  "Clear guidance when you need it",
  "Evidence-based answers",
  "Confidence in your decisions",
  "Immediate help, 24 hours a day",
  "A calm companion by your side",
];

export default function SalesBeforeAfterSection() {
  return (
    <section className="px-4 py-16 md:py-20">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">
            The difference of having Dr. Sleepy
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ScrollReveal delay={0}>
            <div className="bg-card rounded-2xl border border-destructive/20 p-6 h-full">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                  <X className="w-4 h-4 text-destructive" />
                </div>
                <h3 className="font-bold text-foreground">Without Dr. Sleepy</h3>
              </div>
              <div className="space-y-3">
                {beforeItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-destructive/60 shrink-0 mt-0.5" />
                    <p className="text-muted-foreground text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="bg-card rounded-2xl border border-primary/20 p-6 h-full ring-1 ring-primary/10 shadow-lg shadow-primary/5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">With Dr. Sleepy</h3>
              </div>
              <div className="space-y-3">
                {afterItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-foreground text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
