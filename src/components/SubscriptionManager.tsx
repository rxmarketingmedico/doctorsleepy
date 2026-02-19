import { CreditCard, ExternalLink, Calendar, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSubscription } from "@/hooks/useSubscription";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

const HOTMART_MEMBER_AREA = "https://app-vlc.hotmart.com/login";

const planLabels: Record<string, { name: string; price: string }> = {
  mensal: { name: "Monthly Plan", price: "$9.99/month" },
  semestral: { name: "Semi-annual Plan", price: "$29.99/6 months" },
  anual: { name: "Annual Plan", price: "$49.99/year" },
};

export function SubscriptionManager() {
  const { isActive, plan, expiresAt, isExpired, status, loading } = useSubscription();

  if (loading) {
    return (<Card className="card-soft"><CardContent className="py-8 flex justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" /></CardContent></Card>);
  }

  const planInfo = plan ? planLabels[plan.toLowerCase()] : null;

  const getStatusBadge = () => {
    if (isActive) return (<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" />Active</span>);
    if (isExpired) return (<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"><AlertCircle className="w-3.5 h-3.5" />Expired</span>);
    return (<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-muted text-muted-foreground"><Clock className="w-3.5 h-3.5" />Pending</span>);
  };

  return (
    <Card className="card-soft">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2"><CreditCard className="w-5 h-5" />My Plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">{planInfo?.name || "Premium Plan"}</p>
            <p className="text-sm text-muted-foreground">{planInfo?.price || "—"}</p>
          </div>
          {getStatusBadge()}
        </div>
        {expiresAt && (
          <>
            <Separator />
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">{isExpired ? "Expired on" : "Next renewal"}</p>
                <p className="font-medium text-foreground">{format(expiresAt, "MMMM dd, yyyy", { locale: enUS })}</p>
              </div>
            </div>
          </>
        )}
        <Separator />
        <div className="space-y-2">
          {isActive && (
            <Button variant="outline" className="w-full rounded-xl justify-between" onClick={() => window.open(HOTMART_MEMBER_AREA, "_blank")}>
              <span>Manage payments</span><ExternalLink className="w-4 h-4" />
            </Button>
          )}
          {isActive && (
            <Button variant="outline" className="w-full rounded-xl justify-between text-muted-foreground" onClick={() => window.open(HOTMART_MEMBER_AREA, "_blank")}>
              <span>Cancel subscription</span><ExternalLink className="w-4 h-4" />
            </Button>
          )}
          {(!isActive || isExpired) && (
            <Button className="w-full rounded-xl" onClick={() => window.open("https://pay.hotmart.com/F104531830H?off=jihtbtut&checkoutMode=10", "_blank")}>
              {isExpired ? "Renew subscription" : "Subscribe now"}
            </Button>
          )}
        </div>
        {isActive && <p className="text-xs text-center text-muted-foreground">Payment management and cancellation is done through the payment platform.</p>}
      </CardContent>
    </Card>
  );
}
