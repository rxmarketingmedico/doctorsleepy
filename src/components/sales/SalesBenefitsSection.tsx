import { Check } from "lucide-react";

const benefits = [
  "Menos noites em pânico, sem saber o que fazer",
  "Mais confiança nas suas decisões como mãe/pai",
  "Respostas imediatas, sem esperar pelo consultório",
  "Um companheiro calmo nas horas mais difíceis",
  "Mais sono para você — e para o seu bebê",
];

export default function SalesBenefitsSection() {
  return (
    <section className="px-4 py-16 md:py-20 bg-muted/30">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-foreground">
          O que muda na sua vida
        </h2>
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
