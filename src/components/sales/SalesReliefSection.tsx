import { Shield } from "lucide-react";
import peacefulImg from "@/assets/sales/peaceful-parent.jpg";

export default function SalesReliefSection() {
  return (
    <section className="px-4 py-16 md:py-20">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/10">
            <img
              src={peacefulImg}
              alt="Mãe sorrindo com bebê dormindo nos braços"
              className="w-full h-auto object-cover aspect-square"
              loading="lazy"
            />
          </div>
          <div className="text-center md:text-left">
            <div className="w-14 h-14 rounded-full bg-secondary/60 flex items-center justify-center mx-auto md:mx-0 mb-6">
              <Shield className="w-7 h-7 text-secondary-foreground" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Você não precisa resolver tudo sozinha(o).
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Imagina ter alguém disponível 24 horas, que não julga, não cobra e te orienta com calma —
              exatamente no momento em que você mais precisa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
