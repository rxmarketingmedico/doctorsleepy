import { useState, useRef, useCallback } from "react";
import { Mic, Square, AlertTriangle, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AvatarAI } from "@/components/AvatarAI";
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
  details?: string;
  soothingTips?: string[];
  warning: string | null;
}

type Step = "record" | "characteristics" | "analyzing" | "result";

const characteristicOptions = {
  intensity: [
    { value: "low", label: "Low", description: "Soft cry, almost a whimper" },
    { value: "medium", label: "Medium", description: "Normal cry, clearly audible" },
    { value: "high", label: "High", description: "Strong and intense cry" },
  ],
  pattern: [
    { value: "continuous", label: "Continuous", description: "Crying without pauses" },
    { value: "intermittent", label: "Intermittent", description: "Crying with pauses" },
    { value: "rhythmic", label: "Rhythmic", description: "Repetitive pattern" },
  ],
  pitch: [
    { value: "low", label: "Low", description: "Lower tone" },
    { value: "medium", label: "Medium", description: "Normal tone" },
    { value: "high", label: "High", description: "High-pitched, shrill" },
  ],
  duration: [
    { value: "short", label: "Short", description: "A few seconds" },
    { value: "medium", label: "Medium", description: "A few minutes" },
    { value: "long", label: "Long", description: "More than 5 minutes" },
  ],
};

const categoryLabels: Record<string, string> = {
  hunger: "Hunger",
  discomfort: "Discomfort",
  sleep: "Sleep",
  colic: "Colic/Gas",
  pain: "Pain",
  emotional: "Emotional",
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
      toast.error("Could not access the microphone. Check permissions.");
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
        toast.error("You need to be logged in to use this feature");
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
        throw new Error(error.error || "Analysis error");
      }

      const analysisResult = await response.json();
      setResult(analysisResult);
      setStep("result");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Error analyzing the cry");
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
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-foreground">Cry Translator</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto space-y-6">
        <div className="flex justify-center">
          <AvatarAI 
            size="lg" 
            state={
              isRecording ? "listening" : 
              step === "analyzing" ? "thinking" : 
              "idle"
            } 
          />
        </div>

        {step === "record" && (
          <>
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">
                {isRecording ? "Recording..." : "Record your baby's cry"}
              </h2>
              <p className="text-muted-foreground mt-2">
                {isRecording 
                  ? `${formatTime(recordingTime)} — Hold the microphone close to the baby` 
                  : "Press the button to start recording"}
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
                Record for at least 5 seconds for better analysis
              </p>
            )}
          </>
        )}

        {step === "characteristics" && (
          <>
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">
                Describe the cry
              </h2>
              <p className="text-muted-foreground mt-2">
                Select the characteristics you observed
              </p>
            </div>

            <Card className="card-soft">
              <CardContent className="pt-6 space-y-6">
                {renderCharacteristicSelector("intensity", "Cry intensity")}
                {renderCharacteristicSelector("pattern", "Cry pattern")}
                {renderCharacteristicSelector("pitch", "Cry pitch")}
                {renderCharacteristicSelector("duration", "Duration")}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Additional notes (optional)
                  </label>
                  <Textarea
                    value={characteristics.additionalNotes || ""}
                    onChange={(e) =>
                      setCharacteristics((prev) => ({
                        ...prev,
                        additionalNotes: e.target.value,
                      }))
                    }
                    placeholder="E.g.: baby is rubbing eyes, just finished feeding..."
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
                Record again
              </Button>
              <Button
                onClick={analyzeWithAI}
                className="flex-1 h-14 rounded-2xl"
              >
                Analyze with AI
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </>
        )}

        {step === "analyzing" && (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-foreground">
              Analyzing the cry...
            </h2>
            <p className="text-muted-foreground">
              AI is processing the information
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        )}

        {step === "result" && result && (
          <>
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">
                Analysis complete
              </h2>
              <p className="text-muted-foreground mt-2">
                Based on the observed characteristics
              </p>
            </div>

            <Card className="card-soft bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Most likely cause</p>
                  <h3 className="text-2xl font-bold text-primary mt-1">
                    {result.primaryCause}
                  </h3>
                  <p className="text-foreground mt-3">{result.suggestion}</p>
                </div>
              </CardContent>
            </Card>

            {result.details && (
              <Card className="card-soft">
                <CardContent className="pt-6">
                  <p className="text-sm font-medium text-foreground mb-2">Why we reached this conclusion</p>
                  <p className="text-sm text-muted-foreground">{result.details}</p>
                </CardContent>
              </Card>
            )}

            {result.soothingTips && result.soothingTips.length > 0 && (
              <Card className="card-soft">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">💡 Soothing tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {result.soothingTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{tip}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

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

            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="text-lg">Detailed analysis</CardTitle>
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
              New analysis
            </Button>
          </>
        )}

        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Important notice</p>
                <p className="text-xs text-destructive/80 mt-1">
                  This analysis is only guidance based on common patterns. 
                  If you suspect your baby is in pain or significant discomfort, 
                  seek medical attention immediately.
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
