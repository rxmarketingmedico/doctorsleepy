import { Moon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-doutor-soneca.png";
import heroImg from "@/assets/sales/hero-sleeping-baby.jpg";

export default function SalesHero() {
  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <img src={logo} alt="Doutor Soneca" className="h-10 md:h-12 object-contain" />
          <Button
            size="sm"
            className="rounded-xl font-bold"
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
          >
            Assinar
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className="relative px-4 pt-20 pb-24 md:pt-32 md:pb-36">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/15 backdrop-blur-sm text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Moon className="w-4 h-4" />
              Para pais que precisam dormir também
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6 text-foreground drop-shadow-sm">
              Seu bebê não dorme{" "}
              <span className="text-primary">e você também não.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto mb-8">
              Você não está fazendo nada errado. Só precisa de uma ajuda que entenda o que você está vivendo.
            </p>
            <Button
              size="lg"
              className="rounded-2xl px-8 py-6 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            >
              Quero noites melhores
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
