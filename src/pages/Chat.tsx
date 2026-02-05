import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/Avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const contextTitles: Record<string, string> = {
  hunger: "Pode ser fome?",
  sleep: "Pode ser sono?",
  discomfort: "Pode ser desconforto?",
  inconsolable: "Choro inconsolável",
  "night-waking": "Acordou de madrugada",
};

const initialMessages: Record<string, string> = {
  hunger: "Entendo que você está preocupado(a) com a possibilidade de fome. Vou te ajudar a identificar os sinais. Há quanto tempo seu bebê mamou pela última vez?",
  sleep: "Parece que você suspeita que seu bebê está com sono. Vou te ajudar a entender os sinais. Há quanto tempo ele está acordado?",
  discomfort: "Vejo que você acha que pode ser desconforto. Vamos investigar juntos. O bebê está com a fralda limpa? Verificou se há algo incomodando, como roupas apertadas?",
  inconsolable: "Sei que é muito difícil quando o choro não para. Respire fundo, você está fazendo o seu melhor. O bebê está alimentado e com a fralda limpa?",
  "night-waking": "Acordar de madrugada pode ser desafiador. Vamos tentar entender o que está acontecendo. A que horas seu bebê dormiu ontem?",
};

const quickReplies: Record<string, string[]> = {
  hunger: ["Mamou há menos de 1 hora", "Mamou há 2-3 horas", "Mamou há mais de 3 horas"],
  sleep: ["Acordado há menos de 1 hora", "Acordado há 1-2 horas", "Acordado há mais de 2 horas"],
  discomfort: ["Fralda limpa", "Roupas confortáveis", "Ambiente agradável"],
  inconsolable: ["Sim, está alimentado", "Sim, fralda limpa", "Preciso de ajuda urgente"],
  "night-waking": ["Dormiu às 19h", "Dormiu às 20h-21h", "Dormiu depois das 22h"],
};

export default function Chat() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const context = searchParams.get("context") || "hunger";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with context-specific message
    const initialMessage: Message = {
      id: "initial",
      role: "assistant",
      content: initialMessages[context] || initialMessages.hunger,
    };
    setMessages([initialMessage]);
  }, [context]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response (will be replaced with real AI later)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Obrigado por compartilhar. Baseado no que você me disse, aqui estão algumas sugestões que podem ajudar. Lembre-se: cada bebê é único e você conhece seu filho melhor do que ninguém. Se o choro persistir ou você estiver preocupado(a), não hesite em consultar o pediatra.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">
              {contextTitles[context] || "Chat"}
            </h1>
          </div>
          <Avatar size="sm" state={isTyping ? "thinking" : "idle"} />
        </div>
      </header>

      {/* Medical Disclaimer */}
      <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2">
        <div className="flex items-start gap-2 max-w-lg mx-auto">
          <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-xs text-destructive">
            Este app oferece orientações gerais e não substitui aconselhamento médico. 
            Em caso de emergência, procure atendimento profissional.
          </p>
        </div>
      </div>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-lg mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border rounded-bl-md"
                )}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Quick Replies */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <div className="max-w-lg mx-auto flex flex-wrap gap-2">
            {quickReplies[context]?.map((reply) => (
              <Button
                key={reply}
                variant="outline"
                size="sm"
                onClick={() => handleSend(reply)}
                className="rounded-full text-xs"
              >
                {reply}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <footer className="sticky bottom-0 bg-background border-t border-border px-4 py-3 safe-area-bottom">
        <div className="max-w-lg mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder="Digite sua mensagem..."
            className="flex-1 h-12 rounded-2xl"
          />
          <Button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="h-12 w-12 rounded-full"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
