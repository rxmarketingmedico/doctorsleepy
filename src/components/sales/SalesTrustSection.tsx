import { Shield, Clock, Heart } from "lucide-react";
import nurseryImg from "@/assets/sales/nursery-night.jpg";

const trustItems = [
  { icon: Shield, title: "Sem promessas médicas", desc: "Orientações educacionais, nunca diagnósticos." },
  { icon: Clock, title: "Disponível 24h", desc: "Sempre pronto quando você mais precisa." },
  { icon: Heart, title: "Sem julgamento", desc: "Um espaço seguro para tirar suas dúvidas." },
];

export default function SalesTrustSection() {
  return (
    <section className="relative px-4 py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0">
        <img src={nurseryImg} alt="" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
      </div>
      <div className="relative max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">
          Feito com responsabilidade
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {trustItems.map((item, i) => (
            <div key={i} className="bg-card/80 backdrop-blur-sm rounded-2xl p-5 border border-border/40 shadow-sm text-center">
              <div className="w-12 h-12 rounded-xl bg-accent/60 flex items-center justify-center mx-auto mb-3">
                <item.icon className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-bold text-foreground text-sm mb-1">{item.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
