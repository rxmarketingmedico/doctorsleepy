import { Star, Crown, Sparkles, Shield, Clock, Heart, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  "24/7 AI Chat",
  "Cry Translator",
  "Smart Routine",
  "Content Library",
  "Emergency Mode",
  "Auto Night Mode",
];

const plans = [
  {
    name: "Monthly",
    price: "9.90",
    period: "/mo",
    url: "https://pay.hotmart.com/F104531830H?off=jihtbtut&checkoutMode=10",
    icon: Star,
    highlight: false,
    badge: null,
    savings: null,
    pricePerMonth: null,
  },
  {
    name: "Semi-Annual",
    price: "19.90",
    period: "/6 months",
    pricePerMonth: "$3.32/mo",
    savings: "66% OFF",
    url: "https://pay.hotmart.com/F104531830H?off=xx41msm5&checkoutMode=10",
    icon: Crown,
    highlight: true,
    badge: "Most popular",
  },
  {
    name: "Annual",
    price: "29.90",
    period: "/year",
    pricePerMonth: "$2.49/mo",
    savings: "75% OFF",
    url: "https://pay.hotmart.com/F104531830H?off=qxba319z&checkoutMode=10",
    icon: Sparkles,
    highlight: false,
    badge: "Best value",
  },
];

function PricingCard({ plan }: { plan: (typeof plans)[0] }) {
  const isHighlight = plan.highlight;

  return (
    <div
      className={`relative rounded-3xl p-[1px] transition-all duration-500 cursor-pointer group ${
        isHighlight
          ? "bg-gradient-to-b from-primary via-primary/60 to-primary/20 scale-[1.03] md:scale-105"
          : "bg-border/60 hover:bg-primary/30"
      }`}
      onClick={() => window.open(plan.url, "_blank")}
    >
      {plan.badge && (
        <div
          className={`absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 text-xs font-bold px-5 py-1.5 rounded-full shadow-lg ${
            isHighlight
              ? "bg-primary text-primary-foreground shadow-primary/30"
              : "bg-accent text-accent-foreground shadow-accent/20"
          }`}
        >
          {plan.badge}
        </div>
      )}

      <div
        className={`relative rounded-[calc(1.5rem-1px)] p-6 md:p-7 h-full flex flex-col ${
          isHighlight ? "bg-card" : "bg-card"
        }`}
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
              isHighlight
                ? "bg-gradient-to-br from-primary/20 to-primary/5"
                : "bg-muted"
            }`}
          >
            <plan.icon
              className={`w-5 h-5 ${isHighlight ? "text-primary" : "text-muted-foreground"}`}
            />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
            {plan.savings && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {plan.savings}
              </span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-sm text-muted-foreground font-medium">$</span>
            <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              {plan.price}
            </span>
            <span className="text-sm text-muted-foreground">{plan.period}</span>
          </div>
          {plan.pricePerMonth && (
            <p className="text-xs text-muted-foreground mt-1.5">
              equals <span className="font-semibold text-foreground">{plan.pricePerMonth}</span>
            </p>
          )}
        </div>

        <ul className="space-y-2.5 mb-6 flex-1">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm text-foreground">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  isHighlight ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                <Check className="w-3 h-3" strokeWidth={3} />
              </div>
              {feature}
            </li>
          ))}
        </ul>

        <Button
          className={`w-full rounded-2xl font-bold h-12 text-sm transition-all duration-300 ${
            isHighlight
              ? "shadow-lg shadow-primary/25 group-hover:shadow-xl group-hover:shadow-primary/30 group-hover:scale-[1.02]"
              : "group-hover:scale-[1.02]"
          }`}
          variant="default"
          size="lg"
        >
          Subscribe now
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>

        <p className="text-center text-[11px] mt-3 flex items-center justify-center gap-1 text-muted-foreground">
          <Heart className="w-3 h-3" /> Cancel anytime
        </p>
      </div>
    </div>
  );
}

export default function SalesPricingSection() {
  return (
    <section id="pricing" className="px-4 py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Full access
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
              Choose your plan
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
              All tools included. No hidden fees.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6 items-start">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 100}>
              <PricingCard plan={plan} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="flex flex-wrap items-center justify-center gap-5 mt-10 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 border border-border/40 shadow-sm">
              <Shield className="w-3.5 h-3.5 text-primary" /> Secure payment via Hotmart
            </span>
            <span className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 border border-border/40 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-primary" /> Instant access
            </span>
            <span className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 border border-border/40 shadow-sm">
              <Heart className="w-3.5 h-3.5 text-primary" /> 7-day guarantee
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
