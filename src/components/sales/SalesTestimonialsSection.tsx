import { Star, Users } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import camilaImg from "@/assets/sales/testimonial-camila.webp";
import lucasImg from "@/assets/sales/testimonial-lucas.webp";
import anaImg from "@/assets/sales/testimonial-ana.webp";

const testimonials = [
  {
    name: "Camila R.",
    role: "Mãe do Bernardo, 8 meses",
    text: "Eu achava que nunca mais ia dormir. O Doutor Soneca me ajudou a entender os sinais do meu bebê e em 2 semanas já estávamos dormindo melhor.",
    stars: 5,
    avatar: camilaImg,
  },
  {
    name: "Lucas M.",
    role: "Pai da Valentina, 1 ano",
    text: "O tradutor de choro é surreal. Não acertava sempre, mas me dava uma direção quando eu estava perdido às 3h da manhã. Virou meu braço direito.",
    stars: 5,
    avatar: lucasImg,
  },
  {
    name: "Ana Paula S.",
    role: "Mãe da Sofia, 4 meses",
    text: "Finalmente algo que não me julga. Eu perguntava as mesmas coisas várias vezes e ele respondia com paciência. Foi como ter uma amiga pediatra 24h.",
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
              +2.300 famílias já usam
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              O que dizem os pais que usam
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
