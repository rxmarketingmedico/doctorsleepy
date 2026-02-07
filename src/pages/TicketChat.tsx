import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function TicketChat() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: ticket } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("id", ticketId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!ticketId,
  });

  const { data: messages, refetch } = useQuery({
    queryKey: ["ticket-messages", ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ticket_messages")
        .select("*")
        .eq("ticket_id", ticketId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!ticketId,
  });

  // Realtime subscription
  useEffect(() => {
    if (!ticketId) return;
    const channel = supabase
      .channel(`ticket-${ticketId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "ticket_messages",
        filter: `ticket_id=eq.${ticketId}`,
      }, () => {
        refetch();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [ticketId, refetch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user || !ticketId) return;
    setSending(true);
    try {
      const { error } = await supabase
        .from("ticket_messages")
        .insert({ ticket_id: ticketId, sender_id: user.id, content: newMessage.trim(), is_admin: false });
      if (error) throw error;
      setNewMessage("");
      refetch();
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const isResolved = ticket?.status === "resolved";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate("/help")} className="p-1">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-bold text-foreground truncate">{ticket?.subject || "Ticket"}</h1>
            <p className="text-xs text-muted-foreground">Suporte</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full space-y-3">
        {messages?.map((msg) => (
          <div key={msg.id} className={cn("flex", msg.is_admin ? "justify-start" : "justify-end")}>
            <div className={cn(
              "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
              msg.is_admin
                ? "bg-muted text-foreground rounded-bl-md"
                : "bg-primary text-primary-foreground rounded-br-md"
            )}>
              {msg.is_admin && <p className="text-xs font-semibold mb-1 opacity-70">Suporte</p>}
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <p className={cn("text-[10px] mt-1", msg.is_admin ? "text-muted-foreground" : "text-primary-foreground/70")}>
                {new Date(msg.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {isResolved ? (
        <div className="border-t border-border px-4 py-3 text-center text-sm text-muted-foreground bg-muted/30">
          Este ticket foi resolvido.
        </div>
      ) : (
        <div className="border-t border-border px-4 py-3 bg-background">
          <div className="max-w-lg mx-auto flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="min-h-[44px] max-h-[120px] resize-none"
              rows={1}
              maxLength={1000}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button size="icon" onClick={handleSend} disabled={sending || !newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
