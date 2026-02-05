import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Check, Moon, Star, Brain, Clock, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  acceptedTerms: boolean;
}

const totalSteps = 8;

const benefits = [
  { icon: Brain, title: "IA Especializada", description: "Orientações personalizadas baseadas na idade e hábitos do seu bebê" },
  { icon: Moon, title: "Tradutor de Choro", description: "Entenda o que seu bebê está tentando comunicar" },
  { icon: Clock, title: "Rotina Inteligente", description: "Acompanhe padrões de sono e receba previsões" },
  { icon: Star, title: "Modo Emergência", description: "Ajuda rápida quando você mais precisa, 24h" },
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
    acceptedTerms: false,
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthContext();

  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handlePayment = () => {
    // Placeholder - será substituído pela integração com Hotmart/Stripe
    toast({
      title: "Pagamento",
      description: "Integração com pagamento será configurada em breve.",
    });
    handleNext();
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
          subscription_status: "active", // Temporário até integrar pagamento
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Bem-vindo ao Doutor Soneca! 🌙",
        description: "Sua jornada para noites mais tranquilas começa agora.",
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
      case 1: // Boas-vindas
        return true;
      case 2: // Benefícios
        return true;
      case 3: // Pagamento
        return true;
      case 4: // Nome do bebê
        return data.babyName.trim().length > 0;
      case 5: // Data de nascimento
        return true; // Optional
      case 6: // Local de sono
        return data.sleepLocation !== "";
      case 7: // Chupeta
        return data.usesPacifier !== "";
      case 8: // Mamadas + Termos
        return data.nightFeedings !== "" && data.acceptedTerms;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      // Step 1: Boas-vindas
      case 1:
        return (
          <div className="flex flex-col items-center text-center space-y-6">
            <Avatar size="xl" state="idle" />
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-foreground">
                Olá! Eu sou o<br />Doutor Soneca 🌙
              </h1>
              <p className="text-lg text-muted-foreground">
                Seu assistente de sono infantil com inteligência artificial.
              </p>
            </div>
            <div className="bg-secondary/50 rounded-2xl p-6 max-w-sm">
              <p className="text-foreground">
                Vou te ajudar a entender o choro do seu bebê, criar rotinas de sono 
                e ter noites mais tranquilas para toda a família.
              </p>
            </div>
          </div>
        );

      // Step 2: Benefícios
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                O que você vai ter acesso
              </h2>
              <p className="text-muted-foreground mt-2">
                Tudo que você precisa para noites mais tranquilas
              </p>
            </div>
            <div className="grid gap-4">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="card-soft">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      // Step 3: Pagamento
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Comece sua jornada
              </h2>
              <p className="text-muted-foreground mt-2">
                Acesso completo a todos os recursos
              </p>
            </div>

            <Card className="card-soft border-2 border-primary">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                    <Star className="w-4 h-4" />
                    Plano Premium
                  </div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">R$ 49</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Chat ilimitado com IA</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Tradutor de choro ilimitado</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Rotina inteligente completa</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Alertas personalizados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Biblioteca de conteúdos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Suporte prioritário</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  className="w-full h-14 rounded-2xl text-lg font-semibold mt-4"
                >
                  Assinar agora
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Cancele quando quiser. Sem taxas de cancelamento.
                </p>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Pagamento seguro</span>
            </div>
          </div>
        );

      // Step 4: Nome do bebê
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Agora me conta sobre seu bebê
              </h2>
              <p className="text-muted-foreground mt-2">
                Como você chama seu pequeno?
              </p>
            </div>
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
          </div>
        );

      // Step 5: Data de nascimento
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Quando {data.babyName || "o bebê"} nasceu?
              </h2>
              <p className="text-muted-foreground mt-2">
                Isso me ajuda a dar orientações específicas para a idade
              </p>
            </div>
            <div className="space-y-4">
              <Label htmlFor="birthDate" className="text-lg">Data de nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={data.babyBirthDate}
                onChange={(e) => setData({ ...data, babyBirthDate: e.target.value })}
                className="h-14 rounded-2xl text-lg"
              />
              <p className="text-sm text-muted-foreground text-center">
                Este campo é opcional
              </p>
            </div>
          </div>
        );

      // Step 6: Local de sono
      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Onde {data.babyName || "o bebê"} dorme?
              </h2>
              <p className="text-muted-foreground mt-2">
                Cada ambiente tem suas particularidades
              </p>
            </div>
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
          </div>
        );

      // Step 7: Chupeta
      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                {data.babyName || "O bebê"} usa chupeta?
              </h2>
              <p className="text-muted-foreground mt-2">
                A chupeta pode influenciar no sono
              </p>
            </div>
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
          </div>
        );

      // Step 8: Mamadas + Termos
      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Mamadas noturnas
              </h2>
              <p className="text-muted-foreground mt-2">
                Quantas vezes {data.babyName || "o bebê"} mama à noite?
              </p>
            </div>
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

            {/* Termos de uso */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-start space-x-3 p-4 rounded-2xl bg-muted/50">
                <Checkbox
                  id="terms"
                  checked={data.acceptedTerms}
                  onCheckedChange={(checked) => 
                    setData({ ...data, acceptedTerms: checked === true })
                  }
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
                  Entendo que o Doutor Soneca oferece <strong>orientações gerais</strong> e 
                  <strong> não substitui aconselhamento médico</strong>. Em caso de dúvidas 
                  sobre a saúde do meu bebê, devo consultar um profissional de saúde.
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getButtonLabel = () => {
    if (currentStep === 3) return "Continuar para configuração";
    if (currentStep === totalSteps) return loading ? "Salvando..." : "Começar a usar";
    return "Próximo";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Progress */}
      <header className="px-4 py-4">
        <Progress value={progress} className="h-2 rounded-full" />
        <p className="text-sm text-muted-foreground text-center mt-2">
          Passo {currentStep} de {totalSteps}
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-4 py-6 max-w-lg mx-auto w-full">
        {/* Step Content */}
        <div className="flex-1">{renderStep()}</div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {currentStep > 1 && currentStep !== 3 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 h-14 rounded-2xl text-lg"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
          )}
          {currentStep < totalSteps ? (
            currentStep === 3 ? (
              // O botão de pagamento já está no card
              <Button
                variant="ghost"
                onClick={handleNext}
                className="flex-1 h-14 rounded-2xl text-lg text-muted-foreground"
              >
                Pular por enquanto
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex-1 h-14 rounded-2xl text-lg"
              >
                {getButtonLabel()}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            )
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!isStepValid() || loading}
              className="flex-1 h-14 rounded-2xl text-lg"
            >
              {getButtonLabel()}
              <Heart className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
