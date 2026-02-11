import { Moon, ArrowRight, Users, Shield, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-doutor-soneca.webp";
const heroImg = "/images/hero-sleeping-baby.webp";

export default function SalesHero() {
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <img src={logo} alt="Doutor Soneca" className="h-14 md:h-16 object-contain" width={160} height={64} fetchPriority="high" />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl font-semibold"
              onClick={() => navigate("/auth")}
            >
              <LogIn className="w-4 h-4 mr-1.5" />
              Entrar
            </Button>
            <Button
              size="sm"
              className="rounded-xl font-bold"
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            >
              Assinar
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover" width={1920} height={1080} fetchPriority="high" decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background" />
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

            {/* Social proof bar */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-10 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 bg-card/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-border/30">
                <Users className="w-3.5 h-3.5 text-primary" />
                +2.300 famílias confiam
              </span>
              <span className="inline-flex items-center gap-1.5 bg-card/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-border/30">
                <Shield className="w-3.5 h-3.5 text-primary" />
                Baseado em evidências
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
