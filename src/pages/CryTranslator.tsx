import { useState } from "react";
import { Mic, Square, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar } from "@/components/Avatar";
import { cn } from "@/lib/utils";

interface AnalysisResult {
  hunger: number;
  discomfort: number;
  emotional: number;
  pain: number;
}

export default function CryTranslator() {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsAnalyzing(true);
      
      // Simulate analysis
      setTimeout(() => {
        setIsAnalyzing(false);
        setResult({
          hunger: 75,
          discomfort: 20,
          emotional: 45,
          pain: 10,
        });
      }, 2000);
    } else {
      setIsRecording(true);
      setResult(null);
    }
  };

  const getBarColor = (category: string) => {
    switch (category) {
      case "hunger":
        return "bg-hunger";
      case "discomfort":
        return "bg-discomfort";
      case "emotional":
        return "bg-cry";
      case "pain":
        return "bg-destructive";
      default:
        return "bg-primary";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "hunger":
        return "Fome";
      case "discomfort":
        return "Desconforto";
      case "emotional":
        return "Emocional";
      case "pain":
        return "Dor";
      default:
        return category;
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case "hunger":
        return "Choro rítmico que aumenta gradualmente";
      case "discomfort":
        return "Choro intermitente, bebê pode se mexer muito";
      case "emotional":
        return "Necessidade de colo e conforto";
      case "pain":
        return "Choro agudo e súbito";
      default:
        return "";
    }
  };

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
            size="xl" 
            state={isRecording ? "listening" : isAnalyzing ? "thinking" : "idle"} 
          />
        </div>

        {/* Instructions */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">
            {isRecording 
              ? "Gravando..." 
              : isAnalyzing 
                ? "Analisando o choro..." 
                : "Grave o choro do bebê"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {isRecording 
              ? "Aproxime o microfone do bebê" 
              : isAnalyzing 
                ? "Aguarde um momento" 
                : "Pressione o botão para iniciar"}
          </p>
        </div>

        {/* Record Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleRecord}
            disabled={isAnalyzing}
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

        {/* Results */}
        {result && (
          <Card className="card-soft animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg">Análise do choro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(result).map(([category, value]) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">
                      {getCategoryLabel(category)}
                    </span>
                    <span className="text-sm text-muted-foreground">{value}%</span>
                  </div>
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", getBarColor(category))}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {getCategoryDescription(category)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Medical Disclaimer */}
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Aviso importante</p>
                <p className="text-xs text-destructive/80 mt-1">
                  Esta análise é apenas uma orientação. Se você suspeitar que seu bebê 
                  está com dor ou desconforto significativo, procure atendimento médico.
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
