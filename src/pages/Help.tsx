import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, HelpCircle, Plus, ChevronRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";

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

const statusConfig: Record<string, { label: string; icon: typeof Clock; className: string }> = {
  open: { label: "Aberto", icon: AlertCircle, className: "text-yellow-600 bg-yellow-100" },
  in_progress: { label: "Em andamento", icon: Clock, className: "text-blue-600 bg-blue-100" },
  resolved: { label: "Resolvido", icon: CheckCircle2, className: "text-green-600 bg-green-100" },
};

export default function Help() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const { data: tickets, refetch } = useQuery({
    queryKey: ["support-tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim() || !user) return;
    setSending(true);
    try {
      const { data: ticket, error: ticketError } = await supabase
        .from("support_tickets")
        .insert({ user_id: user.id, subject: subject.trim() })
        .select()
        .single();
      if (ticketError) throw ticketError;

      const { error: msgError } = await supabase
        .from("ticket_messages")
        .insert({ ticket_id: ticket.id, sender_id: user.id, content: message.trim(), is_admin: false });
      if (msgError) throw msgError;

      toast({ title: "Ticket criado!", description: "Responderemos em breve." });
      setSubject("");
      setMessage("");
      setShowNewTicket(false);
      refetch();
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Central de Ajuda</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* FAQ Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Perguntas frequentes</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border/60 rounded-2xl overflow-hidden px-1">
                <AccordionTrigger className="text-sm text-left font-medium hover:no-underline px-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm px-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Support Tickets */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Meus tickets de suporte</h2>
            </div>
            <Button size="sm" onClick={() => setShowNewTicket(true)} className="gap-1">
              <Plus className="w-4 h-4" /> Novo
            </Button>
          </div>

          {showNewTicket && (
            <div className="border border-border rounded-2xl p-4 mb-4 space-y-3 bg-card">
              <Input
                placeholder="Assunto"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={100}
              />
              <Textarea
                placeholder="Descreva sua dúvida ou problema..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                rows={4}
              />
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => setShowNewTicket(false)}>
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleSubmit} disabled={sending || !subject.trim() || !message.trim()}>
                  {sending ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </div>
          )}

          {tickets && tickets.length > 0 ? (
            <div className="space-y-2">
              {tickets.map((ticket) => {
                const status = statusConfig[ticket.status] || statusConfig.open;
                const StatusIcon = status.icon;
                return (
                  <button
                    key={ticket.id}
                    onClick={() => navigate(`/help/${ticket.id}`)}
                    className="w-full flex items-center justify-between p-4 border border-border/60 rounded-2xl hover:bg-muted/30 transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(ticket.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <span className={cn("flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium", status.className)}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum ticket aberto. Clique em "Novo" para criar.
            </p>
          )}
        </section>
      </div>
      <BottomNav />
    </div>
  );
}
