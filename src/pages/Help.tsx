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
  { q: "Does Dr. Sleepy replace a pediatrician?", a: "No. Dr. Sleepy is an educational assistant that offers evidence-based guidance on infant sleep. It does not diagnose and does not replace medical care." },
  { q: "From what age can I use it?", a: "The app is designed for parents of babies 0 to 3 years old. Guidance adapts to your baby's age." },
  { q: "How does the Cry Translator work?", a: "You record the baby's cry and artificial intelligence analyzes sound patterns to suggest possible causes: hunger, sleep, discomfort, or pain. It's a support tool, not a diagnosis." },
  { q: "Can I cancel anytime?", a: "Yes. No hassle, no penalties. You can cancel directly through the payment platform at any time." },
  { q: "Is the payment secure?", a: "Yes. Payment is processed through a secure platform with end-to-end encryption." },
  { q: "How do I access the app after paying?", a: "After payment, create your account with the same email used for purchase. Access is granted automatically." },
];

const statusConfig: Record<string, { label: string; icon: typeof Clock; className: string }> = {
  open: { label: "Open", icon: AlertCircle, className: "text-yellow-600 bg-yellow-100" },
  in_progress: { label: "In progress", icon: Clock, className: "text-blue-600 bg-blue-100" },
  resolved: { label: "Resolved", icon: CheckCircle2, className: "text-green-600 bg-green-100" },
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
      const { data, error } = await supabase.from("support_tickets").select("*").order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim() || !user) return;
    setSending(true);
    try {
      const { data: ticket, error: ticketError } = await supabase.from("support_tickets").insert({ user_id: user.id, subject: subject.trim() }).select().single();
      if (ticketError) throw ticketError;
      const { error: msgError } = await supabase.from("ticket_messages").insert({ ticket_id: ticket.id, sender_id: user.id, content: message.trim(), is_admin: false });
      if (msgError) throw msgError;
      toast({ title: "Ticket created!", description: "We'll respond shortly." });
      setSubject(""); setMessage(""); setShowNewTicket(false); refetch();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally { setSending(false); }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
          <h1 className="text-lg font-bold text-foreground">Help Center</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Frequently asked questions</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border/60 rounded-2xl overflow-hidden px-1">
                <AccordionTrigger className="text-sm text-left font-medium hover:no-underline px-4">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm px-4">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">My support tickets</h2>
            </div>
            <Button size="sm" onClick={() => setShowNewTicket(true)} className="gap-1"><Plus className="w-4 h-4" /> New</Button>
          </div>

          {showNewTicket && (
            <div className="border border-border rounded-2xl p-4 mb-4 space-y-3 bg-card">
              <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={100} />
              <Textarea placeholder="Describe your question or issue..." value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} rows={4} />
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => setShowNewTicket(false)}>Cancel</Button>
                <Button size="sm" onClick={handleSubmit} disabled={sending || !subject.trim() || !message.trim()}>
                  {sending ? "Sending..." : "Submit"}
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
                  <button key={ticket.id} onClick={() => navigate(`/help/${ticket.id}`)}
                    className="w-full flex items-center justify-between p-4 border border-border/60 rounded-2xl hover:bg-muted/30 transition-colors text-left">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(ticket.created_at).toLocaleDateString("en-US")}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <span className={cn("flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium", status.className)}>
                        <StatusIcon className="w-3 h-3" />{status.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No tickets open. Click "New" to create one.</p>
          )}
        </section>
      </div>
      <BottomNav />
    </div>
  );
}
