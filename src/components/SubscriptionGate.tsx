import { useSubscription } from "@/hooks/useSubscription";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscriptionGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SubscriptionGate({ children, fallback }: SubscriptionGateProps) {
  const { isActive, loading } = useSubscription();

  if (loading) return null;

  if (!isActive) {
    return fallback || <DefaultPaywall />;
  }

  return <>{children}</>;
}

function DefaultPaywall() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Lock className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">
        Conteúdo exclusivo para assinantes
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Assine o Doutor Soneca para ter acesso a todos os recursos e ajudar seu bebê a dormir melhor.
      </p>
      <Button
        onClick={() => window.open("https://hotmart.com", "_blank")}
        className="bg-primary text-primary-foreground"
      >
        Quero assinar
      </Button>
    </div>
  );
}
