import { Moon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-doutor-soneca.webp";

export default function SalesCTASection() {
  return (
    <>
      <section className="px-4 py-16 md:py-24 bg-primary/5">
        <div className="max-w-2xl mx-auto text-center">
          <Moon className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Hoje pode ser a última noite ruim.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md mx-auto mb-8">
            Você já tentou de tudo. Agora tente ter alguém ao seu lado.
          </p>
          <Button
            size="lg"
            className="rounded-2xl px-8 py-6 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
          >
            Começar agora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      <footer className="px-4 py-8 border-t border-border/40">
        <div className="max-w-2xl mx-auto text-center">
          <img src={logo} alt="Doutor Soneca" className="h-12 mx-auto mb-4 object-contain" />
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
            O Doutor Soneca é um assistente educacional e não substitui acompanhamento médico.
            Em caso de emergência, procure o pediatra do seu bebê.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            © {new Date().getFullYear()} Doutor Soneca. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </>
  );
}
