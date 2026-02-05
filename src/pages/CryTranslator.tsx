import { useState, useRef, useCallback } from "react";
import { Mic, Square, AlertTriangle, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar } from "@/components/Avatar";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface CryCharacteristics {
  intensity: "low" | "medium" | "high";
  pattern: "continuous" | "intermittent" | "rhythmic";
  pitch: "low" | "medium" | "high";
  duration: "short" | "medium" | "long";
  additionalNotes?: string;
}

interface AnalysisResult {
  analysis: {
    hunger: number;
    discomfort: number;
    sleep: number;
    colic: number;
    pain: number;
    emotional: number;
  };
  primaryCause: string;
  suggestion: string;
  warning: string | null;
}

type Step = "record" | "characteristics" | "analyzing" | "result";

const characteristicOptions = {
  intensity: [
    { value: "low", label: "Baixa", description: "Choro suave, quase um gemido" },
    { value: "medium", label: "Média", description: "Choro normal, audível claramente" },
    { value: "high", label: "Alta", description: "Choro forte e intenso" },
  ],
  pattern: [
    { value: "continuous", label: "Contínuo", description: "Choro sem pausas" },
    { value: "intermittent", label: "Intermitente", description: "Choro com pausas" },
    { value: "rhythmic", label: "Rítmico", description: "Choro com padrão repetitivo" },
  ],
  pitch: [
    { value: "low", label: "Grave", description: "Tom mais baixo" },
    { value: "medium", label: "Médio", description: "Tom normal" },
    { value: "high", label: "Agudo", description: "Tom alto, estridente" },
  ],
  duration: [
    { value: "short", label: "Curta", description: "Poucos segundos" },
    { value: "medium", label: "Média", description: "Alguns minutos" },
    { value: "long", label: "Longa", description: "Mais de 5 minutos" },
  ],
};

const categoryLabels: Record<string, string> = {
  hunger: "Fome",
  discomfort: "Desconforto",
  sleep: "Sono",
  colic: "Cólica/Gases",
  pain: "Dor",
  emotional: "Emocional",
};

const categoryColors: Record<string, string> = {
  hunger: "bg-hunger",
  discomfort: "bg-discomfort",
  sleep: "bg-sleep",
  colic: "bg-amber-500",
  pain: "bg-destructive",
  emotional: "bg-cry",
};

export default function CryTranslator() {
  const [step, setStep] = useState<Step>("record");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [characteristics, setCharacteristics] = useState<CryCharacteristics>({
    intensity: "medium",
    pattern: "continuous",
    pitch: "medium",
    duration: "medium",
  });
  const [result, setResult] = useState<AnalysisResult | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Não foi possível acessar o microfone. Verifique as permissões.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setIsRecording(false);
    setStep("characteristics");
  }, []);

  const handleRecord = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const analyzeWithAI = async () => {
    setStep("analyzing");
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Você precisa estar logado para usar esta funcionalidade");
        setStep("record");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-cry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ characteristics }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao analisar");
      }

      const analysisResult = await response.json();
      setResult(analysisResult);
      setStep("result");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao analisar o choro");
      setStep("characteristics");
    }
  };

  const resetAnalysis = () => {
    setStep("record");
    setResult(null);
    setRecordingTime(0);
    setCharacteristics({
      intensity: "medium",
      pattern: "continuous",
      pitch: "medium",
      duration: "medium",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderCharacteristicSelector = (
    key: keyof typeof characteristicOptions,
    label: string
  ) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="grid grid-cols-3 gap-2">
        {characteristicOptions[key].map((option) => (
          <button
            key={option.value}
            onClick={() =>
              setCharacteristics((prev) => ({ ...prev, [key]: option.value }))
            }
            className={cn(
              "p-3 rounded-xl border-2 text-left transition-all",
              characteristics[key] === option.value
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{option.label}</span>
              {characteristics[key] === option.value && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-foreground">Tradutor de Choro</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Avatar */}
        <div className="flex justify-center">
          <Avatar 
            size="lg" 
            state={
              isRecording ? "listening" : 
              step === "analyzing" ? "thinking" : 
              "idle"
            } 
          />
        </div>

        {/* Step: Record */}
        {step === "record" && (
          <>
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">
                {isRecording ? "Gravando..." : "Grave o choro do bebê"}
              </h2>
              <p className="text-muted-foreground mt-2">
                {isRecording 
                  ? `${formatTime(recordingTime)} - Aproxime o microfone do bebê` 
                  : "Pressione o botão para iniciar a gravação"}
              </p>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleRecord}
                className={cn(
                  "w-32 h-32 rounded-full text-lg font-semibold transition-all",
                  isRecording 
                    ? "bg-destructive hover:bg-destructive/90 animate-pulse" 
                    : "bg-primary hover:bg-primary/90"
                )}
              >
                {isRecording ? (
                  <Square className="w-12 h-12" />
                ) : (
                  <Mic className="w-12 h-12" />
                )}
              </Button>
            </div>

            {isRecording && (
              <p className="text-center text-sm text-muted-foreground">
                Grave por pelo menos 5 segundos para melhor análise
              </p>
            )}
          </>
        )}

        {/* Step: Characteristics */}
        {step === "characteristics" && (
          <>
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">
                Descreva o choro
              </h2>
              <p className="text-muted-foreground mt-2">
                Selecione as características que você observou
              </p>
            </div>

            <Card className="card-soft">
              <CardContent className="pt-6 space-y-6">
                {renderCharacteristicSelector("intensity", "Intensidade do choro")}
                {renderCharacteristicSelector("pattern", "Padrão do choro")}
                {renderCharacteristicSelector("pitch", "Tom do choro")}
                {renderCharacteristicSelector("duration", "Duração")}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Observações adicionais (opcional)
                  </label>
                  <Textarea
                    value={characteristics.additionalNotes || ""}
                    onChange={(e) =>
                      setCharacteristics((prev) => ({
                        ...prev,
                        additionalNotes: e.target.value,
                      }))
                    }
                    placeholder="Ex: bebê está esfregando os olhos, acabou de mamar..."
                    className="rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={resetAnalysis}
                className="flex-1 h-14 rounded-2xl"
              >
                Gravar novamente
              </Button>
              <Button
                onClick={analyzeWithAI}
                className="flex-1 h-14 rounded-2xl"
              >
                Analisar com IA
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </>
        )}

        {/* Step: Analyzing */}
        {step === "analyzing" && (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-foreground">
              Analisando o choro...
            </h2>
            <p className="text-muted-foreground">
              A IA está processando as informações
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        )}

        {/* Step: Result */}
        {step === "result" && result && (
          <>
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">
                Análise concluída
              </h2>
              <p className="text-muted-foreground mt-2">
                Baseado nas características observadas
              </p>
            </div>

            {/* Primary Cause */}
            <Card className="card-soft bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Causa mais provável</p>
                  <h3 className="text-2xl font-bold text-primary mt-1">
                    {result.primaryCause}
                  </h3>
                  <p className="text-foreground mt-3">{result.suggestion}</p>
                </div>
              </CardContent>
            </Card>

            {/* Warning */}
            {result.warning && (
              <Card className="bg-destructive/10 border-destructive/20">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{result.warning}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Detailed Analysis */}
            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="text-lg">Análise detalhada</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(result.analysis)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, value]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-foreground">
                          {categoryLabels[category] || category}
                        </span>
                        <span className="text-sm text-muted-foreground">{value}%</span>
                      </div>
                      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            categoryColors[category] || "bg-primary"
                          )}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Button
              onClick={resetAnalysis}
              className="w-full h-14 rounded-2xl"
            >
              Nova análise
            </Button>
          </>
        )}

        {/* Medical Disclaimer */}
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Aviso importante</p>
                <p className="text-xs text-destructive/80 mt-1">
                  Esta análise é apenas uma orientação baseada em padrões comuns. 
                  Se você suspeitar que seu bebê está com dor ou desconforto significativo, 
                  procure atendimento médico imediatamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
