import { Star, Crown, Sparkles, Shield, Clock, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackMetaEvent } from "@/components/MetaPixel";
import { ScrollReveal } from "@/hooks/useScrollReveal";

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

function PricingCard({ plan }: { plan: typeof plans[0] }) {
  return (
    <div
      className={`relative rounded-3xl p-6 transition-all duration-300 cursor-pointer group ${
        plan.highlight
          ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/20 scale-[1.02] ring-2 ring-primary/30"
          : "bg-card border border-border/60 hover:shadow-lg hover:border-primary/30"
      }`}
      onClick={() => {
        trackMetaEvent("InitiateCheckout", {
          content_name: plan.name,
          currency: "BRL",
          value: parseFloat(plan.price.replace(/[^\d]/g, "")),
        });
        window.open(plan.url, "_blank");
      }}
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

export default function SalesPricingSection() {
  return (
    <section id="pricing" className="px-4 py-16 md:py-24 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-foreground">
            Escolha seu plano
          </h2>
          <p className="text-center text-muted-foreground mb-10 text-sm md:text-base">
            Acesso completo a todas as ferramentas. Cancele quando quiser.
          </p>
        </ScrollReveal>
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
  );
}
