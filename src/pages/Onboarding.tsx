import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/Avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";

interface OnboardingData {
  babyName: string;
  babyBirthDate: string;
  sleepLocation: string;
  usesPacifier: string;
  nightFeedings: string;
}

const steps = [
  { id: 1, title: "Nome do bebê", description: "Como você chama seu pequeno?" },
  { id: 2, title: "Data de nascimento", description: "Quando seu bebê nasceu?" },
  { id: 3, title: "Local de sono", description: "Onde seu bebê costuma dormir?" },
  { id: 4, title: "Chupeta", description: "Seu bebê usa chupeta?" },
  { id: 5, title: "Mamadas noturnas", description: "Quantas vezes por noite seu bebê mama?" },
];

const sleepLocations = [
  { value: "crib", label: "Berço no quarto dos pais" },
  { value: "own-room", label: "Berço no próprio quarto" },
  { value: "co-sleep", label: "Cama compartilhada" },
  { value: "bassinet", label: "Moisés" },
];

const nightFeedingOptions = [
  { value: "0", label: "Nenhuma" },
  { value: "1-2", label: "1 a 2 vezes" },
  { value: "3-4", label: "3 a 4 vezes" },
  { value: "5+", label: "5 ou mais vezes" },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    babyName: "",
    babyBirthDate: "",
    sleepLocation: "",
    usesPacifier: "",
    nightFeedings: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthContext();

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          baby_name: data.babyName,
          baby_birth_date: data.babyBirthDate || null,
          sleep_location: data.sleepLocation,
          uses_pacifier: data.usesPacifier === "yes",
          night_feedings: parseInt(data.nightFeedings.split("-")[0]) || 0,
          onboarding_completed: true,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Configuração concluída!",
        description: "Bem-vindo ao Doutor Soneca!",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return data.babyName.trim().length > 0;
      case 2:
        return true; // Optional
      case 3:
        return data.sleepLocation !== "";
      case 4:
        return data.usesPacifier !== "";
      case 5:
        return data.nightFeedings !== "";
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Label htmlFor="babyName" className="text-lg">Nome do bebê</Label>
            <Input
              id="babyName"
              placeholder="Ex: Maria, João..."
              value={data.babyName}
              onChange={(e) => setData({ ...data, babyName: e.target.value })}
              className="h-14 rounded-2xl text-lg"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <Label htmlFor="birthDate" className="text-lg">Data de nascimento</Label>
            <Input
              id="birthDate"
              type="date"
              value={data.babyBirthDate}
              onChange={(e) => setData({ ...data, babyBirthDate: e.target.value })}
              className="h-14 rounded-2xl text-lg"
            />
          </div>
        );
      case 3:
        return (
          <RadioGroup
            value={data.sleepLocation}
            onValueChange={(value) => setData({ ...data, sleepLocation: value })}
            className="space-y-3"
          >
            {sleepLocations.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-3 p-4 rounded-2xl border-2 border-border hover:border-primary transition-colors cursor-pointer"
                onClick={() => setData({ ...data, sleepLocation: option.value })}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="text-base cursor-pointer flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 4:
        return (
          <RadioGroup
            value={data.usesPacifier}
            onValueChange={(value) => setData({ ...data, usesPacifier: value })}
            className="space-y-3"
          >
            <div
              className="flex items-center space-x-3 p-4 rounded-2xl border-2 border-border hover:border-primary transition-colors cursor-pointer"
              onClick={() => setData({ ...data, usesPacifier: "yes" })}
            >
              <RadioGroupItem value="yes" id="pacifier-yes" />
              <Label htmlFor="pacifier-yes" className="text-base cursor-pointer flex-1">
                Sim, usa chupeta
              </Label>
            </div>
            <div
              className="flex items-center space-x-3 p-4 rounded-2xl border-2 border-border hover:border-primary transition-colors cursor-pointer"
              onClick={() => setData({ ...data, usesPacifier: "no" })}
            >
              <RadioGroupItem value="no" id="pacifier-no" />
              <Label htmlFor="pacifier-no" className="text-base cursor-pointer flex-1">
                Não usa chupeta
              </Label>
            </div>
          </RadioGroup>
        );
      case 5:
        return (
          <RadioGroup
            value={data.nightFeedings}
            onValueChange={(value) => setData({ ...data, nightFeedings: value })}
            className="space-y-3"
          >
            {nightFeedingOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-3 p-4 rounded-2xl border-2 border-border hover:border-primary transition-colors cursor-pointer"
                onClick={() => setData({ ...data, nightFeedings: option.value })}
              >
                <RadioGroupItem value={option.value} id={`feeding-${option.value}`} />
                <Label htmlFor={`feeding-${option.value}`} className="text-base cursor-pointer flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Progress */}
      <header className="px-4 py-4">
        <Progress value={progress} className="h-2 rounded-full" />
        <p className="text-sm text-muted-foreground text-center mt-2">
          Passo {currentStep} de {steps.length}
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-4 py-6 max-w-lg mx-auto w-full">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <Avatar size="lg" state="idle" />
        </div>

        {/* Step Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            {steps[currentStep - 1].title}
          </h1>
          <p className="text-muted-foreground mt-2">
            {steps[currentStep - 1].description}
          </p>
        </div>

        {/* Step Content */}
        <div className="flex-1">{renderStep()}</div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 h-14 rounded-2xl text-lg"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
          )}
          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex-1 h-14 rounded-2xl text-lg"
            >
              Próximo
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!isStepValid() || loading}
              className="flex-1 h-14 rounded-2xl text-lg"
            >
              {loading ? "Salvando..." : "Concluir"}
              <Check className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
