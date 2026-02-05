import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/Avatar";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

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

// Respostas contextuais baseadas na entrada do usuário
const getContextualResponse = (context: string, userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (context === "inconsolable") {
    if (lowerMessage.includes("alimentado") || lowerMessage.includes("sim")) {
      return `Ótimo que o bebê está alimentado! Aqui estão algumas técnicas que podem ajudar a acalmar um choro inconsolável:

**🤱 Técnica dos 5 S's (Dr. Harvey Karp):**
1. **Swaddle (Enrolar)** - Enrole o bebê firme em uma manta
2. **Side/Stomach (Lado)** - Segure deitado de lado ou de bruços no seu colo
3. **Shush (Shhhh)** - Faça sons de "shhhh" perto do ouvido
4. **Swing (Balançar)** - Balance suavemente
5. **Suck (Sugar)** - Ofereça chupeta ou o dedo limpo

**🌡️ Verifique também:**
- Temperatura do ambiente (ideal: 20-22°C)
- Roupas muito quentes ou muito frias
- Gases - tente massagem na barriguinha em círculos

**⚠️ Se o choro persistir por mais de 2 horas ou notar febre, procure atendimento médico.**

O que você gostaria de tentar primeiro?`;
    }
    if (lowerMessage.includes("fralda")) {
      return `Perfeito, fralda limpa! Agora vamos verificar outras possibilidades:

**🤔 Possíveis causas:**
- **Cólicas** - Comum em bebês até 3-4 meses
- **Gases** - Tente a posição de "bicicleta" com as perninhas
- **Superestimulação** - Ambiente muito barulhento ou iluminado
- **Necessidade de colo** - Bebês precisam de contato físico

**💆 Técnicas calmantes:**
1. Coloque o bebê pele a pele no seu peito
2. Caminhe balançando suavemente
3. Use ruído branco (secador de cabelo, aspirador, app)
4. Banho morno pode ajudar a relaxar

Seu bebê tem menos de 3 meses?`;
    }
    if (lowerMessage.includes("ajuda") || lowerMessage.includes("urgente")) {
      return `Entendo sua preocupação. Vou te ajudar a avaliar:

**🚨 Procure atendimento médico se:**
- Choro agudo e diferente do normal
- Febre acima de 37.5°C
- Recusa alimentação por mais de 6 horas
- Vômitos repetidos
- Pele com manchas ou muito pálida
- Dificuldade para respirar
- Moleira afundada ou muito saliente

**📞 Se nenhum sinal de alerta:**
Respire fundo. Bebês choram, e às vezes sem motivo aparente. Você está fazendo um ótimo trabalho ao buscar ajuda.

Está observando algum desses sinais de alerta?`;
    }
  }
  
  if (context === "hunger") {
    if (lowerMessage.includes("menos de 1 hora") || lowerMessage.includes("1 hora")) {
      return `Se mamou há menos de 1 hora, provavelmente não é fome. Bebês podem querer mamar por conforto, não só por fome.

**🔍 Outros sinais a observar:**
- Está levando a mão à boca?
- Fazendo movimentos de sucção?
- Virando a cabeça procurando o peito?

**💡 Pode ser:**
- Necessidade de sucção (ofereça chupeta)
- Cólica ou gases
- Sono (verifique há quanto tempo está acordado)

Quer que eu ajude a identificar outros sinais?`;
    }
    if (lowerMessage.includes("2") || lowerMessage.includes("3 horas")) {
      return `Mamou há 2-3 horas - pode sim ser fome, especialmente se o bebê tem menos de 3 meses.

**🍼 Sinais claros de fome:**
- Leva as mãos à boca
- Faz movimentos de sucção
- Vira a cabeça procurando o peito
- Fica agitado e inquieto
- Choro que aumenta gradualmente

**💡 Dica:** O choro é o último sinal de fome. Tente oferecer antes do choro intenso para uma mamada mais tranquila.

Seu bebê está mostrando esses sinais?`;
    }
  }
  
  if (context === "sleep") {
    if (lowerMessage.includes("menos de 1") || lowerMessage.includes("1 hora")) {
      return `Acordado há menos de 1 hora - para a maioria das idades, ainda não é hora de dormir.

**⏰ Janelas de sono por idade:**
- 0-6 semanas: 45-60 min acordado
- 6-12 semanas: 1-1.5 horas
- 3-4 meses: 1.5-2 horas
- 5-6 meses: 2-2.5 horas

Qual a idade do seu bebê para eu te dar orientações mais específicas?`;
    }
    if (lowerMessage.includes("2 horas") || lowerMessage.includes("mais de 2")) {
      return `Acordado há mais de 2 horas - dependendo da idade, pode estar cansado demais!

**😴 Sinais de sono:**
- Bocejos
- Esfregar os olhos
- Olhar fixo/vidrado
- Movimentos descoordenados
- Ficar "grudento"
- Perder interesse em brincar

**💡 Dica importante:** Bebê muito cansado tem mais dificuldade para dormir. Coloque para dormir ao primeiro sinal.

**🌙 Rotina de sono:**
1. Diminua estímulos (luz, som)
2. Troque fralda
3. Enrole em manta (se bebê pequeno)
4. Balance suavemente
5. Use ruído branco

Quer que eu te guie em uma rotina de sono?`;
    }
  }
  
  if (context === "discomfort") {
    if (lowerMessage.includes("fralda") && lowerMessage.includes("limp")) {
      return `Fralda limpa ✓ Ótimo! Vamos verificar outras causas de desconforto:

**👕 Roupas:**
- Etiquetas que podem incomodar?
- Elásticos muito apertados?
- Tecido áspero?

**🌡️ Temperatura:**
- Toque a nuca do bebê (não mãos/pés)
- Deve estar morninha, não quente nem fria
- Ideal: 1 camada a mais que você

**💨 Gases:**
- Massagem na barriga em sentido horário
- Posição de "bicicleta" com as pernas
- Deite de bruços no seu antebraço

**🔍 Outros:**
- Cabelo enrolado no dedo (síndrome do torniquete)
- Picada de inseto
- Assadura começando

Verificou as roupas e temperatura?`;
    }
  }
  
  if (context === "night-waking") {
    if (lowerMessage.includes("19") || lowerMessage.includes("20") || lowerMessage.includes("21")) {
      return `Dormiu entre 19h-21h - esse é um bom horário!

**🌙 Por que acordou?**
Despertar noturno é normal. Bebês têm ciclos de sono de 45-60 min.

**💡 Dicas para ajudar a voltar a dormir:**
1. Espere alguns minutos antes de intervir
2. Mantenha o ambiente escuro
3. Fale baixinho ou não fale
4. Evite trocar fralda se não estiver suja
5. Ofereça mama/mamadeira se for horário

**⏰ Número de despertares por idade:**
- 0-3 meses: 2-4 vezes (normal)
- 3-6 meses: 1-3 vezes
- 6-12 meses: 0-2 vezes

Quantas vezes seu bebê acorda normalmente?`;
    }
  }
  
  // Resposta padrão mais útil
  return `Obrigado por compartilhar! Baseado no que você me disse, aqui estão algumas orientações:

**🔍 Próximos passos:**
1. Observe o comportamento do bebê nos próximos minutos
2. Tente uma técnica calmante (colo, balanço, ruído branco)
3. Verifique necessidades básicas (fome, fralda, temperatura)

**💡 Lembre-se:**
- Você conhece seu bebê melhor que ninguém
- Chorar é a forma do bebê se comunicar
- É normal não saber a causa imediatamente

Quer que eu te ajude com algo mais específico?`;
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

    // Get contextual response based on user input
    setTimeout(() => {
      const responseContent = getContextualResponse(context, content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
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
                {message.role === "assistant" ? (
                  <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-strong:text-foreground">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{message.content}</p>
                )}
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
