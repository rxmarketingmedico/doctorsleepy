import { MessageCircle, Mic, BedDouble, BookOpen, Moon, Baby } from "lucide-react";
import appMockupImg from "@/assets/sales/app-mockup.jpg";

const benefits = [
  { icon: MessageCircle, title: "Chat com IA 24h", desc: "Orientações personalizadas a qualquer hora da noite." },
  { icon: Mic, title: "Tradutor de Choro", desc: "Entenda o que seu bebê está tentando dizer." },
  { icon: BedDouble, title: "Rotina Inteligente", desc: "Registre e acompanhe o sono do seu bebê." },
  { icon: BookOpen, title: "Biblioteca de Conteúdos", desc: "Artigos e áudios sobre sono infantil." },
  { icon: Moon, title: "Modo Noturno Automático", desc: "Tela adaptada para uso de madrugada." },
  { icon: Baby, title: "Modo Emergência", desc: "Ajuda rápida quando o bebê acorda chorando." },
];

export default function SalesSolutionSection() {
  return (
    <section className="px-4 py-16 md:py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Conheça o <span className="text-primary">Doutor Soneca</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg mx-auto">
            Um assistente inteligente que ajuda pais a entenderem o sono do bebê e a encontrarem respostas
            rápidas — sem precisar agendar consulta, sem esperar, sem julgamento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <div className="w-72 md:w-80 rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
              <img
                src={appMockupImg}
                alt="Doutor Soneca app no celular"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-4 border border-border/40 shadow-sm text-left flex gap-3 items-start hover:shadow-md transition-shadow"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <b.icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm mb-0.5">{b.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
