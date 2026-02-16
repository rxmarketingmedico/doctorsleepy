import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarAI } from "@/components/AvatarAI";
import { QuickReplies } from "@/components/chat/QuickReplies";
import { useDynamicSuggestions } from "@/hooks/useDynamicSuggestions";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const contextTitles: Record<string, string> = {
  hunger: "Could it be hunger?",
  sleep: "Could it be sleep?",
  discomfort: "Could it be discomfort?",
  inconsolable: "Inconsolable crying",
  "night-waking": "Woke up at night",
  general: "Chat with Dr. Sleepy",
};

const initialMessages: Record<string, string> = {
  hunger: "Hello! I see you're worried about possible hunger. Let me help you identify the signs. How long ago did your baby last feed?",
  sleep: "Hello! It seems you suspect your baby is sleepy. Let me help you understand the signs. How long has your baby been awake?",
  discomfort: "Hello! I see you think it might be discomfort. Let's investigate together. Is the diaper clean? Have you checked if something is bothering your baby?",
  inconsolable: "Hello! I know it's very hard when the crying won't stop. Take a deep breath, you're doing your best. Has the baby been fed and has a clean diaper?",
  "night-waking": "Hello! Waking up at night can be challenging. Let's try to understand what's happening. What time did your baby go to sleep last night?",
  general: "Hello! 👋 I'm Dr. Sleepy, your assistant specializing in infant sleep and baby care. How can I help you today? You can ask me about sleep, feeding, crying, routines, or any questions about your little one!",
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const SAVE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-assistant-message`;

export default function Chat() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const context = searchParams.get("context") || "hunger";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const suggestions = useDynamicSuggestions(messages, context);

  useEffect(() => {
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

  const streamChat = useCallback(async (
    chatMessages: { role: string; content: string }[],
    onDelta: (text: string) => void,
    onDone: (fullContent: string) => void
  ) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("You need to be logged in to use the chat");
      throw new Error("Not authenticated");
    }

    const response = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ 
        messages: chatMessages,
        context 
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      if (response.status === 429) {
        toast.error("Too many messages. Please wait a few seconds.");
      } else if (response.status === 402) {
        toast.error("AI credits exhausted.");
      } else {
        toast.error(error.error || "Error processing message");
      }
      throw new Error(error.error || "Failed to start stream");
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let textBuffer = "";
    let fullContent = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            fullContent += content;
            onDelta(content);
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Final flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            fullContent += content;
            onDelta(content);
          }
        } catch { /* ignore */ }
      }
    }

    onDone(fullContent);
  }, [context]);

  const saveAssistantMessage = useCallback(async (content: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      await fetch(SAVE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ content, context }),
      });
    } catch (error) {
      console.error("Failed to save assistant message:", error);
    }
  }, [context]);

  const handleSend = async (content: string) => {
    if (!content.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    let assistantContent = "";
    
    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.id !== "initial") {
          return prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: "assistant", 
          content: assistantContent 
        }];
      });
    };

    try {
      const chatMessages = messages
        .filter(m => m.id !== "initial")
        .concat(userMessage)
        .map(m => ({ role: m.role, content: m.content }));

      await streamChat(
        chatMessages,
        updateAssistant,
        async (fullContent) => {
          setIsTyping(false);
          await saveAssistantMessage(fullContent);
        }
      );
    } catch (error) {
      console.error("Chat error:", error);
      setIsTyping(false);
      
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I'm having difficulties right now. Please try again in a few seconds. 💙"
      }]);
    }
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
            <p className="text-xs text-muted-foreground">Dr. Sleepy</p>
          </div>
          <AvatarAI size="sm" state={isTyping ? "thinking" : "idle"} />
        </div>
      </header>

      {/* Medical Disclaimer */}
      <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2">
        <div className="flex items-start gap-2 max-w-lg mx-auto">
          <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-xs text-destructive">
            This app provides general guidance and does not replace medical advice. 
            In case of emergency, seek professional care.
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
              {message.role === "assistant" && (
                <div className="mr-2 flex-shrink-0">
                  <AvatarAI size="sm" state={isTyping && message.id !== "initial" ? "thinking" : "idle"} />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3",
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
          
          {isTyping && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="mr-2 flex-shrink-0">
                <AvatarAI size="sm" state="thinking" />
              </div>
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
      {!isTyping && (
        <QuickReplies
          suggestions={suggestions}
          onSelect={handleSend}
          disabled={isTyping}
        />
      )}

      {/* Input */}
      <footer className="sticky bottom-0 bg-background border-t border-border px-4 py-3 safe-area-bottom">
        <div className="max-w-lg mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend(input)}
            placeholder="Type your message..."
            className="flex-1 h-12 rounded-2xl"
            disabled={isTyping}
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
