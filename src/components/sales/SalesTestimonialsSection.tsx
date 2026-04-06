import { Star, Users } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import camilaImg from "@/assets/sales/testimonial-camila.webp";
import lucasImg from "@/assets/sales/testimonial-lucas.webp";
import anaImg from "@/assets/sales/testimonial-ana.webp";

const testimonials = [
  {
    name: "Jessica R.",
    role: "Mom of Ethan, 8 months",
    text: "I thought I'd never sleep again. Dr. Sleepy helped me understand my baby's cues and within 2 weeks we were sleeping much better.",
    stars: 5,
    avatar: camilaImg,
  },
  {
    name: "Lucas M.",
    role: "Dad of Valentina, 1 year",
    text: "The cry translator is amazing. It didn't always get it right, but it gave me direction when I was lost at 3am. It became my right hand.",
    stars: 5,
    avatar: lucasImg,
  },
  {
    name: "Ana Paula S.",
    role: "Mom of Sofia, 4 months",
    text: "Finally something that doesn't judge me. I asked the same questions multiple times and it answered patiently. It was like having a pediatrician friend 24/7.",
    stars: 5,
    avatar: anaImg,
  },
];

export default function SalesTestimonialsSection() {
  return (
    <section className="px-4 py-16 md:py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              +2,300 families already use it
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              What parents are saying
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <ScrollReveal key={i} delay={i * 150}>
              <div className="bg-card rounded-2xl p-6 border border-border/40 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground text-sm leading-relaxed mb-4 flex-1">
                  "{t.text}"
                </p>
                <div className="border-t border-border/40 pt-3 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                    loading="lazy"
                    decoding="async"
                    width={40}
                    height={40}
                  />
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-muted-foreground text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
