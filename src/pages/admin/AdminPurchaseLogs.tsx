import { useEffect, useState } from "react";
import { ArrowLeft, Search, RefreshCw, CreditCard, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface PurchaseLog {
  id: string;
  email: string;
  event: string;
  subscription_status: string;
  subscription_plan: string | null;
  subscription_expires_at: string | null;
  hotmart_transaction_id: string | null;
  processed: boolean;
  created_at: string;
}

const eventLabels: Record<string, { label: string; icon: typeof CheckCircle; color: string }> = {
  PURCHASE_APPROVED: { label: "Aprovada", icon: CheckCircle, color: "text-emerald-500" },
  PURCHASE_COMPLETE: { label: "Completa", icon: CheckCircle, color: "text-emerald-500" },
  PURCHASE_CANCELED: { label: "Cancelada", icon: XCircle, color: "text-destructive" },
  PURCHASE_REFUNDED: { label: "Reembolsada", icon: XCircle, color: "text-destructive" },
  PURCHASE_CHARGEBACK: { label: "Chargeback", icon: AlertTriangle, color: "text-destructive" },
  PURCHASE_BILLET_PRINTED: { label: "PIX/Boleto gerado", icon: Clock, color: "text-amber-500" },
  PURCHASE_DELAYED: { label: "Atrasada", icon: Clock, color: "text-amber-500" },
  PURCHASE_PROTEST: { label: "Protesto", icon: AlertTriangle, color: "text-amber-500" },
  SUBSCRIPTION_CANCELLATION: { label: "Assinatura cancelada", icon: XCircle, color: "text-destructive" },
  SUBSCRIPTION_REACTIVATION: { label: "Reativada", icon: CheckCircle, color: "text-emerald-500" },
};

function getEventInfo(event: string) {
  return eventLabels[event] || { label: event, icon: CreditCard, color: "text-muted-foreground" };
}

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge variant="default">Ativo</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Cancelado</Badge>;
    case "pending":
      return <Badge variant="secondary">Pendente</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function AdminPurchaseLogs() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<PurchaseLog[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("pending_activations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching purchase logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const filtered = logs.filter((log) => {
    const q = search.toLowerCase();
    return (
      log.email.toLowerCase().includes(q) ||
      log.event.toLowerCase().includes(q) ||
      (log.hotmart_transaction_id?.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Logs de Compras</h1>
            <p className="text-sm text-muted-foreground">{logs.length} eventos registrados</p>
          </div>
        </div>
        <Button variant="outline" size="icon" onClick={fetchLogs} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por email ou transação..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 rounded-xl"
        />
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Carregando...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">Nenhum log encontrado.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((log) => {
            const eventInfo = getEventInfo(log.event);
            const EventIcon = eventInfo.icon;
            return (
              <Card key={log.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <EventIcon className={`w-5 h-5 ${eventInfo.color}`} />
                      <div>
                        <p className="font-semibold text-sm text-foreground">{eventInfo.label}</p>
                        <p className="text-xs text-muted-foreground">{log.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getStatusBadge(log.subscription_status)}
                      {log.processed && (
                        <Badge variant="outline" className="text-xs">Processado ✓</Badge>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">Plano:</span>{" "}
                      {log.subscription_plan || "—"}
                    </div>
                    <div>
                      <span className="font-medium">Transação:</span>{" "}
                      <span className="font-mono">{log.hotmart_transaction_id?.slice(0, 12) || "—"}</span>
                    </div>
                    <div>
                      <span className="font-medium">Data:</span>{" "}
                      {new Date(log.created_at).toLocaleString("pt-BR")}
                    </div>
                    {log.subscription_expires_at && (
                      <div>
                        <span className="font-medium">Expira:</span>{" "}
                        {new Date(log.subscription_expires_at).toLocaleDateString("pt-BR")}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
