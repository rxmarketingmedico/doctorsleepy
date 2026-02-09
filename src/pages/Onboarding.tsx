import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Moon, Star, Brain, Clock, Heart, Users, Baby } from "lucide-react";
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
  // Parent info
  parentName: string;
  isFirstChild: string;
  parentExperience: string;
  hasSupportNetwork: string;
  mainConcerns: string[];
  // Baby info
  babyName: string;
  babyBirthDate: string;
  feedingType: string;
  sleepLocation: string;
  usesPacifier: string;
  nightFeedings: string;
  usualBedtime: string;
  mainChallenge: string;
  specialConditions: string[];
  acceptedTerms: boolean;
}

const totalSteps = 14;

const benefits = [
  { icon: Brain, title: "IA Especializada", description: "Orientações personalizadas baseadas na idade e hábitos do seu bebê" },
  { icon: Moon, title: "Tradutor de Choro", description: "Entenda o que seu bebê está tentando comunicar" },
  { icon: Clock, title: "Rotina Inteligente", description: "Acompanhe padrões de sono e receba previsões" },
  { icon: Star, title: "Modo Emergência", description: "Ajuda rápida quando você mais precisa, 24h" },
];

const experienceOptions = [
  { value: "none", label: "Nenhuma experiência", description: "É minha primeira vez cuidando de um bebê" },
  { value: "some", label: "Alguma experiência", description: "Já ajudei com sobrinhos, afilhados ou trabalho" },
  { value: "experienced", label: "Experiência com outros filhos", description: "Já tenho outros filhos" },
];

const concernOptions = [
  { value: "sleep", label: "Sono do bebê" },
  { value: "feeding", label: "Alimentação" },
  { value: "crying", label: "Choro excessivo" },
  { value: "development", label: "Desenvolvimento" },
  { value: "routine", label: "Criar rotina" },
  { value: "health", label: "Saúde geral" },
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

const feedingTypeOptions = [
  { value: "breastfeeding", label: "Amamentação exclusiva", description: "Apenas leite materno" },
  { value: "formula", label: "Fórmula", description: "Apenas fórmula infantil" },
  { value: "mixed", label: "Misto", description: "Leite materno + fórmula" },
  { value: "solids", label: "Já come sólidos", description: "Introdução alimentar iniciada" },
];

const bedtimeOptions = [
  { value: "before-19", label: "Antes das 19h" },
  { value: "19-20", label: "Entre 19h e 20h" },
  { value: "20-21", label: "Entre 20h e 21h" },
  { value: "21-22", label: "Entre 21h e 22h" },
  { value: "after-22", label: "Depois das 22h" },
  { value: "irregular", label: "Não tem horário fixo" },
];

const specialConditionOptions = [
  { value: "reflux", label: "Refluxo" },
  { value: "colic", label: "Cólicas intensas" },
  { value: "premature", label: "Prematuro" },
  { value: "allergy", label: "Alergia alimentar" },
  { value: "dermatitis", label: "Dermatite" },
  { value: "none", label: "Nenhuma" },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    parentName: "",
    isFirstChild: "",
    parentExperience: "",
    hasSupportNetwork: "",
    mainConcerns: [],
    babyName: "",
    babyBirthDate: "",
    feedingType: "",
    sleepLocation: "",
    usesPacifier: "",
    nightFeedings: "",
    usualBedtime: "",
    mainChallenge: "",
    specialConditions: [],
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



  const toggleItems = (field: 'mainConcerns' | 'specialConditions', value: string) => {
    setData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((c: string) => c !== value)
        : [...prev[field], value]
    }));
  };

  const handleComplete = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          parent_name: data.parentName,
          is_first_child: data.isFirstChild === "yes",
          parent_experience: data.parentExperience,
          has_support_network: data.hasSupportNetwork === "yes",
          main_concerns: data.mainConcerns,
          baby_name: data.babyName,
          baby_birth_date: data.babyBirthDate || null,
          feeding_type: data.feedingType,
          sleep_location: data.sleepLocation,
          uses_pacifier: data.usesPacifier === "yes",
          night_feedings: parseInt(data.nightFeedings.split("-")[0]) || 0,
          usual_bedtime: data.usualBedtime,
          main_challenge: data.mainChallenge || null,
          special_conditions: data.specialConditions.filter(c => c !== "none"),
          onboarding_completed: true,
          subscription_status: "active",
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
      case 1: return true; // Boas-vindas
      case 2: return true; // Benefícios
      case 3: return data.parentName.trim().length > 0;
      case 4: return data.isFirstChild !== "";
      case 5: return data.parentExperience !== "";
      case 6: return data.babyName.trim().length > 0;
      case 7: return true; // Data de nascimento (opcional)
      case 8: return data.feedingType !== ""; // Tipo de alimentação
      case 9: return data.sleepLocation !== "";
      case 10: return data.usesPacifier !== "";
      case 11: return data.nightFeedings !== "";
      case 12: return data.usualBedtime !== ""; // Horário de dormir
      case 13: return true; // Desafio principal (opcional)
      case 14: return data.acceptedTerms; // Condições especiais + Termos
      default: return false;
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

      // Step 3: Nome do responsável
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Vamos nos conhecer melhor
              </h2>
              <p className="text-muted-foreground mt-2">
                Como posso te chamar?
              </p>
            </div>
            <div className="space-y-4">
              <Label htmlFor="parentName" className="text-lg">Seu nome</Label>
              <Input
                id="parentName"
                placeholder="Ex: Maria, João..."
                value={data.parentName}
                onChange={(e) => setData({ ...data, parentName: e.target.value })}
                className="h-14 rounded-2xl text-lg"
              />
            </div>
          </div>
        );

      // Step 4: Primeiro filho
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Baby className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {data.parentName ? `${data.parentName}, ` : ""}Este é seu primeiro filho(a)?
              </h2>
              <p className="text-muted-foreground mt-2">
                Isso me ajuda a personalizar as orientações
              </p>
            </div>
            <RadioGroup
              value={data.isFirstChild}
              onValueChange={(value) => setData({ ...data, isFirstChild: value })}
              className="space-y-3"
            >
              <div
                className="flex items-center space-x-3 p-4 rounded-2xl border-2 border-border hover:border-primary transition-colors cursor-pointer"
                onClick={() => setData({ ...data, isFirstChild: "yes" })}
              >
                <RadioGroupItem value="yes" id="first-yes" />
                <Label htmlFor="first-yes" className="text-base cursor-pointer flex-1">
                  Sim, é meu primeiro filho(a)
                </Label>
              </div>
              <div
                className="flex items-center space-x-3 p-4 rounded-2xl border-2 border-border hover:border-primary transition-colors cursor-pointer"
                onClick={() => setData({ ...data, isFirstChild: "no" })}
              >
                <RadioGroupItem value="no" id="first-no" />
                <Label htmlFor="first-no" className="text-base cursor-pointer flex-1">
                  Não, já tenho outros filhos
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      // Step 5: Experiência
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Qual sua experiência com bebês?
              </h2>
              <p className="text-muted-foreground mt-2">
                Assim posso adaptar a linguagem das orientações
              </p>
            </div>
            <RadioGroup
              value={data.parentExperience}
              onValueChange={(value) => setData({ ...data, parentExperience: value })}
              className="space-y-3"
            >
              {experienceOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-start space-x-3 p-4 rounded-2xl border-2 border-border hover:border-primary transition-colors cursor-pointer"
                  onClick={() => setData({ ...data, parentExperience: option.value })}
                >
                  <RadioGroupItem value={option.value} id={`exp-${option.value}`} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={`exp-${option.value}`} className="text-base cursor-pointer font-medium">
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>

            {/* Rede de apoio */}
            <div className="pt-4 border-t border-border">
              <p className="text-base font-medium text-foreground mb-3">
                Você tem uma rede de apoio?
              </p>
              <RadioGroup
                value={data.hasSupportNetwork}
                onValueChange={(value) => setData({ ...data, hasSupportNetwork: value })}
                className="flex gap-4"
              >
                <div
                  className="flex-1 flex items-center justify-center space-x-2 p-3 rounded-xl border-2 border-border hover:border-primary transition-colors cursor-pointer"
                  onClick={() => setData({ ...data, hasSupportNetwork: "yes" })}
                >
                  <RadioGroupItem value="yes" id="support-yes" />
                  <Label htmlFor="support-yes" className="cursor-pointer">Sim</Label>
                </div>
                <div
                  className="flex-1 flex items-center justify-center space-x-2 p-3 rounded-xl border-2 border-border hover:border-primary transition-colors cursor-pointer"
                  onClick={() => setData({ ...data, hasSupportNetwork: "no" })}
                >
                  <RadioGroupItem value="no" id="support-no" />
                  <Label htmlFor="support-no" className="cursor-pointer">Não</Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Família, amigos ou profissionais que ajudam nos cuidados
              </p>
            </div>

            {/* Principais preocupações */}
            <div className="pt-4 border-t border-border">
              <p className="text-base font-medium text-foreground mb-3">
                Quais suas principais preocupações? (opcional)
              </p>
              <div className="flex flex-wrap gap-2">
                {concernOptions.map((concern) => (
                  <button
                    key={concern.value}
                    type="button"
                    onClick={() => toggleItems('mainConcerns', concern.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      data.mainConcerns.includes(concern.value)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {concern.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      // Step 6: Nome do bebê
      case 6:
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

      // Step 7: Data de nascimento
      case 7:
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

      // Step 8: Tipo de alimentação (NEW)
      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Como {data.babyName || "o bebê"} se alimenta?
              </h2>
              <p className="text-muted-foreground mt-2">
                O tipo de alimentação influencia o sono e as orientações
              </p>
            </div>
            <RadioGroup
              value={data.feedingType}
              onValueChange={(value) => setData({ ...data, feedingType: value })}
              className="space-y-3"
            >
              {feedingTypeOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-start space-x-3 p-4 rounded-2xl border-2 border-border hover:border-primary transition-colors cursor-pointer"
                  onClick={() => setData({ ...data, feedingType: option.value })}
                >
                  <RadioGroupItem value={option.value} id={`feed-${option.value}`} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={`feed-${option.value}`} className="text-base cursor-pointer font-medium">
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      // Step 9: Local de sono
      case 9:
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

      // Step 10: Chupeta
      case 10:
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

      // Step 11: Mamadas noturnas
      case 11:
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
          </div>
        );

      // Step 12: Horário habitual de dormir (NEW)
      case 12:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                A que horas {data.babyName || "o bebê"} costuma dormir?
              </h2>
              <p className="text-muted-foreground mt-2">
                Saber o horário me ajuda a calibrar as janelas de sono
              </p>
            </div>
            <RadioGroup
              value={data.usualBedtime}
              onValueChange={(value) => setData({ ...data, usualBedtime: value })}
              className="space-y-3"
            >
              {bedtimeOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 p-4 rounded-2xl border-2 border-border hover:border-primary transition-colors cursor-pointer"
                  onClick={() => setData({ ...data, usualBedtime: option.value })}
                >
                  <RadioGroupItem value={option.value} id={`bedtime-${option.value}`} />
                  <Label htmlFor={`bedtime-${option.value}`} className="text-base cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      // Step 13: Principal desafio atual (NEW)
      case 13:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Qual o maior desafio hoje?
              </h2>
              <p className="text-muted-foreground mt-2">
                Descreva em poucas palavras para eu priorizar o que é mais urgente
              </p>
            </div>
            <div className="space-y-4">
              <Input
                id="mainChallenge"
                placeholder="Ex: demora pra dormir, acorda 5x por noite..."
                value={data.mainChallenge}
                onChange={(e) => setData({ ...data, mainChallenge: e.target.value })}
                className="h-14 rounded-2xl text-lg"
              />
              <p className="text-sm text-muted-foreground text-center">
                Este campo é opcional
              </p>
            </div>
          </div>
        );

      // Step 14: Condições especiais + Termos (NEW)
      case 14:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                {data.babyName || "O bebê"} tem alguma condição especial?
              </h2>
              <p className="text-muted-foreground mt-2">
                Isso muda as recomendações de sono e alimentação
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {specialConditionOptions.map((condition) => (
                <button
                  key={condition.value}
                  type="button"
                  onClick={() => {
                    if (condition.value === "none") {
                      setData(prev => ({ ...prev, specialConditions: ["none"] }));
                    } else {
                      const filtered = data.specialConditions.filter(c => c !== "none");
                      const updated = filtered.includes(condition.value)
                        ? filtered.filter(c => c !== condition.value)
                        : [...filtered, condition.value];
                      setData(prev => ({ ...prev, specialConditions: updated }));
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    data.specialConditions.includes(condition.value)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {condition.label}
                </button>
              ))}
            </div>

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
      <main className="flex-1 flex flex-col px-4 py-6 max-w-lg mx-auto w-full overflow-y-auto">
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
          {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex-1 h-14 rounded-2xl text-lg"
              >
                {getButtonLabel()}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
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
