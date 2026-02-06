import { useState } from "react";
import { Moon, Star, Shield, Heart, Clock, MessageCircle, Baby, ChevronDown, ChevronUp, Sparkles, Crown, Check, ArrowRight, Mic, BookOpen, BedDouble } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-doutor-soneca.png";

const plans = [
  {
    name: "Mensal",
    price: "R$ 47",
    period: "/mês",
    url: "https://pay.hotmart.com/G104310879F?off=a4i8bvbk&checkoutMode=10",
    icon: Star,
    highlight: false,
  },
  {
    name: "Semestral",
    price: "R$ 127",
    period: "/6 meses",
    pricePerMonth: "R$ 21/mês",
    savings: "Economize 55%",
    url: "https://pay.hotmart.com/G104310879F?off=bwvgswt4&checkoutMode=10",
    icon: Crown,
    highlight: true,
  },
  {
    name: "Anual",
    price: "R$ 197",
    period: "/ano",
    pricePerMonth: "R$ 16/mês",
    savings: "Economize 65%",
    url: "https://pay.hotmart.com/G104310879F?off=ca4ts232&checkoutMode=10",
    icon: Sparkles,
    highlight: false,
  },
];

const faqs = [
  {
    q: "O Doutor Soneca substitui o pediatra?",
    a: "Não. O Doutor Soneca é um assistente educacional que oferece orientações baseadas em evidências sobre sono infantil. Ele não faz diagnósticos e não substitui acompanhamento médico.",
  },
  {
    q: "A partir de qual idade posso usar?",
    a: "O app é pensado para pais de bebês de 0 a 3 anos. As orientações se adaptam à idade do seu bebê.",
  },
  {
    q: "Como funciona o Tradutor de Choro?",
    a: "Você grava o choro do bebê e a inteligência artificial analisa padrões sonoros para sugerir possíveis causas: fome, sono, desconforto ou dor. É uma ferramenta de apoio, não um diagnóstico.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim. Sem burocracia, sem multa. Você cancela direto pela Hotmart a qualquer momento.",
  },
  {
    q: "O pagamento é seguro?",
    a: "Sim. O pagamento é processado pela Hotmart, a maior plataforma de produtos digitais da América Latina, com criptografia de ponta.",
  },
  {
    q: "Como acesso o app depois de pagar?",
    a: "Após o pagamento, você cria sua conta com o mesmo e-mail usado na compra. O acesso é liberado automaticamente.",
  },
];

const benefits = [
  { icon: MessageCircle, title: "Chat com IA 24h", desc: "Orientações personalizadas a qualquer hora da noite." },
  { icon: Mic, title: "Tradutor de Choro", desc: "Entenda o que seu bebê está tentando dizer." },
  { icon: BedDouble, title: "Rotina Inteligente", desc: "Registre e acompanhe o sono do seu bebê." },
  { icon: BookOpen, title: "Biblioteca de Conteúdos", desc: "Artigos e áudios sobre sono infantil." },
  { icon: Moon, title: "Modo Noturno Automático", desc: "Tela adaptada para uso de madrugada." },
  { icon: Baby, title: "Modo Emergência", desc: "Ajuda rápida quando o bebê acorda chorando." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/60 rounded-2xl overflow-hidden transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="font-semibold text-foreground text-sm md:text-base pr-4">{q}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed animate-fade-in">
          {a}
        </div>
      )}
    </div>
  );
}

function PricingCard({ plan }: { plan: typeof plans[0] }) {
  return (
    <div
      className={`relative rounded-3xl p-6 transition-all duration-300 cursor-pointer group ${
        plan.highlight
          ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/20 scale-[1.02] ring-2 ring-primary/30"
          : "bg-card border border-border/60 hover:shadow-lg hover:border-primary/30"
      }`}
      onClick={() => window.open(plan.url, "_blank")}
    >
      {plan.highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-4 py-1 rounded-full">
          Mais popular
        </div>
      )}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          plan.highlight ? "bg-primary-foreground/20" : "bg-primary/10"
        }`}>
          <plan.icon className={`w-5 h-5 ${plan.highlight ? "text-primary-foreground" : "text-primary"}`} />
        </div>
        <div>
          <h3 className={`font-bold text-lg ${plan.highlight ? "" : "text-foreground"}`}>{plan.name}</h3>
          {plan.savings && (
            <span className={`text-xs font-medium ${plan.highlight ? "text-primary-foreground/80" : "text-primary"}`}>
              {plan.savings}
            </span>
          )}
        </div>
      </div>
      <div className="mb-4">
        <span className={`text-3xl font-extrabold ${plan.highlight ? "" : "text-foreground"}`}>{plan.price}</span>
        <span className={`text-sm ${plan.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{plan.period}</span>
        {plan.pricePerMonth && (
          <p className={`text-xs mt-1 ${plan.highlight ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
            equivale a {plan.pricePerMonth}
          </p>
        )}
      </div>
      <Button
        className={`w-full rounded-xl font-bold group-hover:scale-[1.02] transition-transform ${
          plan.highlight
            ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            : ""
        }`}
        variant={plan.highlight ? "secondary" : "default"}
        size="lg"
      >
        Assinar agora
        <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}

export default function SalesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ====== HEADER ====== */}
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

      {/* ====== DOBRA 1 — IDENTIFICAÇÃO ====== */}
      <section className="relative px-4 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Moon className="w-4 h-4" />
            Para pais que precisam dormir também
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6 text-foreground">
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
      </section>

      {/* ====== DOBRA 2 — DOR ====== */}
      <section className="px-4 py-16 md:py-20 bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">
            Você se identifica com isso?
          </h2>
          <div className="space-y-4">
            {[
              "Seu bebê acorda várias vezes durante a noite",
              "Você não sabe se é fome, dor ou só hábito",
              "Está exausta(o) e ninguém parece entender",
              "Já pesquisou tudo no Google e cada site diz algo diferente",
              "Sente culpa por não conseguir resolver sozinha(o)",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-card rounded-2xl p-4 border border-border/40 shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Heart className="w-3.5 h-3.5 text-destructive" />
                </div>
                <p className="text-foreground text-sm md:text-base">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-8 text-sm">
            Se você marcou ao menos um, o Doutor Soneca foi feito para você.
          </p>
        </div>
      </section>

      {/* ====== DOBRA 3 — ALÍVIO ====== */}
      <section className="px-4 py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-secondary/60 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-secondary-foreground" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Você não precisa resolver tudo sozinha(o).
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg mx-auto">
            Imagina ter alguém disponível 24 horas, que não julga, não cobra e te orienta com calma — 
            exatamente no momento em que você mais precisa.
          </p>
        </div>
      </section>

      {/* ====== DOBRA 4 — SOLUÇÃO ====== */}
      <section className="px-4 py-16 md:py-20 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Conheça o <span className="text-primary">Doutor Soneca</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg mx-auto mb-10">
            Um assistente inteligente que ajuda pais a entenderem o sono do bebê e a encontrarem respostas 
            rápidas — sem precisar agendar consulta, sem esperar, sem julgamento.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-5 border border-border/40 shadow-sm text-left flex gap-4 items-start hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <b.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm mb-1">{b.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== DOBRA 5 — SEGURANÇA ====== */}
      <section className="px-4 py-16 md:py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">
            Feito com responsabilidade
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: "Sem promessas médicas", desc: "Orientações educacionais, nunca diagnósticos." },
              { icon: Clock, title: "Disponível 24h", desc: "Sempre pronto quando você mais precisa." },
              { icon: Heart, title: "Sem julgamento", desc: "Um espaço seguro para tirar suas dúvidas." },
            ].map((item, i) => (
              <div key={i} className="bg-card rounded-2xl p-5 border border-border/40 shadow-sm text-center">
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

      {/* ====== DOBRA 6 — BENEFÍCIOS EMOCIONAIS ====== */}
      <section className="px-4 py-16 md:py-20 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-foreground">
            O que muda na sua vida
          </h2>
          <div className="space-y-4">
            {[
              "Menos noites em pânico, sem saber o que fazer",
              "Mais confiança nas suas decisões como mãe/pai",
              "Respostas imediatas, sem esperar pelo consultório",
              "Um companheiro calmo nas horas mais difíceis",
              "Mais sono para você — e para o seu bebê",
            ].map((item, i) => (
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

      {/* ====== DOBRA 7 — QUALIFICAÇÃO ====== */}
      <section className="px-4 py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            O Doutor Soneca é para você se…
          </h2>
          <div className="space-y-3 mt-8">
            {[
              "Seu bebê tem entre 0 e 3 anos",
              "Você quer orientações baseadas em evidências",
              "Prefere resolver dúvidas na hora, sem filas",
              "Valoriza ajuda sem julgamento e sem cobrança",
            ].map((item, i) => (
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

      {/* ====== DOBRA 8 — OFERTA / PRICING ====== */}
      <section id="pricing" className="px-4 py-16 md:py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-foreground">
            Escolha seu plano
          </h2>
          <p className="text-center text-muted-foreground mb-10 text-sm md:text-base">
            Acesso completo a todas as ferramentas. Cancele quando quiser.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {plans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Pagamento seguro via Hotmart</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Acesso imediato</span>
            <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> Cancele quando quiser</span>
          </div>
        </div>
      </section>

      {/* ====== DOBRA 9 — FAQ ====== */}
      <section className="px-4 py-16 md:py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">
            Perguntas frequentes
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ====== DOBRA 10 — CTA FINAL ====== */}
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

      {/* ====== FOOTER ====== */}
      <footer className="px-4 py-8 border-t border-border/40">
        <div className="max-w-2xl mx-auto text-center">
          <img src={logo} alt="Doutor Soneca" className="h-8 mx-auto mb-4 object-contain" />
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
            O Doutor Soneca é um assistente educacional e não substitui acompanhamento médico. 
            Em caso de emergência, procure o pediatra do seu bebê.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            © {new Date().getFullYear()} Doutor Soneca. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
