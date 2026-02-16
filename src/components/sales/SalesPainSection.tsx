import { Heart } from "lucide-react";
import tiredParentImg from "@/assets/sales/tired-parent.webp";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const painPoints = [
  "Your baby wakes up multiple times during the night",
  "You don't know if it's hunger, pain, or just a habit",
  "You're exhausted and nobody seems to understand",
  "You've Googled everything and every site says something different",
  "You feel guilty for not being able to figure it out alone",
];

export default function SalesPainSection() {
  return (
    <section className="px-4 py-16 md:py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">
            Does this sound like you?
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1 space-y-4">
            {painPoints.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-card rounded-2xl p-4 border border-border/40 shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Heart className="w-3.5 h-3.5 text-destructive" />
                </div>
                <p className="text-foreground text-sm md:text-base">{item}</p>
              </div>
            ))}
          </div>
          <div className="order-1 md:order-2">
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/10">
              <img
                src={tiredParentImg}
                alt="Tired parent with crying baby at night"
                className="w-full h-auto object-cover aspect-square"
                loading="lazy"
                decoding="async"
                width={672}
                height={672}
              />
            </div>
          </div>
        </div>
        <p className="text-center text-muted-foreground mt-8 text-sm">
          If you checked at least one, Dr. Sleepy was made for you.
        </p>
      </div>
    </section>
  );
}
