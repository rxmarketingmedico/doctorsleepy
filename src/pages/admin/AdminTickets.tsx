import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, CheckCircle2, Clock, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; icon: typeof Clock; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  open: { label: "Open", icon: AlertCircle, variant: "destructive" },
  in_progress: { label: "In progress", icon: Clock, variant: "default" },
  resolved: { label: "Resolved", icon: CheckCircle2, variant: "secondary" },
};

export default function AdminTickets() {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: tickets, refetch: refetchTickets } = useQuery({
    queryKey: ["admin-tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      const userIds = [...new Set(data.map(t => t.user_id))];
      const emailMap: Record<string, string> = {};
      for (const uid of userIds) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("parent_name, baby_name")
          .eq("user_id", uid)
          .maybeSingle();
        emailMap[uid] = profile?.parent_name || profile?.baby_name || uid.slice(0, 8);
      }
      return data.map(t => ({ ...t, userName: emailMap[t.user_id] || t.user_id.slice(0, 8) }));
    },
  });

  const { data: messages, refetch: refetchMessages } = useQuery({
    queryKey: ["admin-ticket-messages", selectedTicket],
    queryFn: async () => {
      if (!selectedTicket) return [];
      const { data, error } = await supabase
        .from("ticket_messages")
        .select("*")
        .eq("ticket_id", selectedTicket)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!selectedTicket,
  });

  useEffect(() => {
    const channel = supabase
      .channel("admin-tickets-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "support_tickets" }, () => refetchTickets())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "ticket_messages" }, () => {
        refetchMessages();
        refetchTickets();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [refetchTickets, refetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleReply = async () => {
    if (!reply.trim() || !user || !selectedTicket) return;
    setSending(true);
    try {
      const { error } = await supabase
        .from("ticket_messages")
        .insert({ ticket_id: selectedTicket, sender_id: user.id, content: reply.trim(), is_admin: true });
      if (error) throw error;

      const ticket = tickets?.find(t => t.id === selectedTicket);
      if (ticket?.status === "open") {
        await supabase.from("support_tickets").update({ status: "in_progress" }).eq("id", selectedTicket);
        refetchTickets();
      }

      setReply("");
      refetchMessages();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    await supabase.from("support_tickets").update({ status: newStatus }).eq("id", ticketId);
    refetchTickets();
  };

  const selectedTicketData = tickets?.find(t => t.id === selectedTicket);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        Support Tickets
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[500px]">
        {/* Ticket List */}
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="bg-muted/50 px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-foreground">Tickets ({tickets?.length || 0})</p>
          </div>
          <div className="overflow-y-auto max-h-[500px] divide-y divide-border">
            {tickets?.map((ticket) => {
              const status = statusConfig[ticket.status] || statusConfig.open;
              return (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket.id)}
                  className={cn(
                    "w-full text-left p-3 hover:bg-muted/30 transition-colors",
                    selectedTicket === ticket.id && "bg-muted/50"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground">{ticket.userName}</p>
                    </div>
                    <Badge variant={status.variant} className="text-[10px] shrink-0">
                      {status.label}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(ticket.updated_at).toLocaleDateString("en-US")}
                  </p>
                </button>
              );
            })}
            {(!tickets || tickets.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-8">No tickets found</p>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 border border-border rounded-xl flex flex-col overflow-hidden">
          {selectedTicket && selectedTicketData ? (
            <>
              <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{selectedTicketData.subject}</p>
                  <p className="text-xs text-muted-foreground">{selectedTicketData.userName}</p>
                </div>
                <div className="flex gap-1">
                  {selectedTicketData.status !== "resolved" && (
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange(selectedTicket, "resolved")} className="text-xs gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Resolve
                    </Button>
                  )}
                  {selectedTicketData.status === "resolved" && (
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange(selectedTicket, "open")} className="text-xs">
                      Reopen
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[350px]">
                {messages?.map((msg) => (
                  <div key={msg.id} className={cn("flex", msg.is_admin ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                      msg.is_admin
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    )}>
                      {!msg.is_admin && <p className="text-xs font-semibold mb-1 opacity-70">User</p>}
                      {msg.is_admin && <p className="text-xs font-semibold mb-1 opacity-70">You (Admin)</p>}
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p className={cn("text-[10px] mt-1", msg.is_admin ? "text-primary-foreground/70" : "text-muted-foreground")}>
                        {new Date(msg.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="border-t border-border p-3 flex gap-2">
                <Textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Reply..."
                  className="min-h-[44px] max-h-[100px] resize-none"
                  rows={1}
                  maxLength={1000}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleReply();
                    }
                  }}
                />
                <Button size="icon" onClick={handleReply} disabled={sending || !reply.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Select a ticket to view
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
