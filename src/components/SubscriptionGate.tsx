import { useSubscription } from "@/hooks/useSubscription";
import { Lock, Star, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SubscriptionGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const plans = [
  { name: "Monthly", price: "$9.99", period: "/month", url: "https://pay.hotmart.com/F104531830H?off=jihtbtut&checkoutMode=10", icon: Star, highlight: false },
  { name: "Semi-annual", price: "$29.99", period: "/6 months", savings: "Save 50%", url: "https://pay.hotmart.com/F104531830H?off=xx41msm5&checkoutMode=10", icon: Crown, highlight: true },
  { name: "Annual", price: "$49.99", period: "/year", savings: "Save 58%", url: "https://pay.hotmart.com/F104531830H?off=qxba319z&checkoutMode=10", icon: Sparkles, highlight: false },
];

export function SubscriptionGate({ children, fallback }: SubscriptionGateProps) {
  const { isActive, loading } = useSubscription();
  if (loading) return null;
  if (!isActive) return fallback || <DefaultPaywall />;
  return <>{children}</>;
}

function DefaultPaywall() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Lock className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Exclusive access for subscribers</h2>
      <p className="text-muted-foreground text-center mb-8 max-w-sm">
        Subscribe to Dr. Sleepy and get unlimited access to all tools to help your baby sleep better.
      </p>
      <div className="w-full max-w-sm space-y-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={`cursor-pointer transition-all hover:shadow-lg ${plan.highlight ? "border-primary ring-2 ring-primary/20" : "border-border"}`} onClick={() => window.open(plan.url, "_blank")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.highlight ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <plan.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground">{plan.name}</h3>
                    {plan.savings && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{plan.savings}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground"><span className="text-lg font-bold text-foreground">{plan.price}</span>{plan.period}</p>
                </div>
                <Button size="sm" variant={plan.highlight ? "default" : "outline"} className="shrink-0">Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-6 text-center max-w-xs">Secure payment. Cancel anytime.</p>
    </div>
  );
}
