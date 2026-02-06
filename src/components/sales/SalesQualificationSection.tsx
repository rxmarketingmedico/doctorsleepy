import { Check } from "lucide-react";

const qualifications = [
  "Seu bebê tem entre 0 e 3 anos",
  "Você quer orientações baseadas em evidências",
  "Prefere resolver dúvidas na hora, sem filas",
  "Valoriza ajuda sem julgamento e sem cobrança",
];

export default function SalesQualificationSection() {
  return (
    <section className="px-4 py-16 md:py-20">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
          O Doutor Soneca é para você se…
        </h2>
        <div className="space-y-3 mt-8">
          {qualifications.map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-left">
              <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <p className="text-foreground text-sm md:text-base">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
