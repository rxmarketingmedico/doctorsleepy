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
  { icon: Brain, title: "Specialized AI", description: "Personalized guidance based on your baby's age and habits" },
  { icon: Moon, title: "Cry Translator", description: "Understand what your baby is trying to communicate" },
  { icon: Clock, title: "Smart Routine", description: "Track sleep patterns and receive predictions" },
  { icon: Star, title: "Emergency Mode", description: "Quick help when you need it most, 24/7" },
];

const experienceOptions = [
  { value: "none", label: "No experience", description: "It's my first time caring for a baby" },
  { value: "some", label: "Some experience", description: "I've helped with nephews, godchildren, or work" },
  { value: "experienced", label: "Experienced with other children", description: "I already have other children" },
];

const concernOptions = [
  { value: "sleep", label: "Baby sleep" },
  { value: "feeding", label: "Feeding" },
  { value: "crying", label: "Excessive crying" },
  { value: "development", label: "Development" },
  { value: "routine", label: "Creating a routine" },
  { value: "health", label: "General health" },
];

const sleepLocations = [
  { value: "crib", label: "Crib in parents' room" },
  { value: "own-room", label: "Crib in own room" },
  { value: "co-sleep", label: "Co-sleeping" },
  { value: "bassinet", label: "Bassinet" },
];

const nightFeedingOptions = [
  { value: "0", label: "None" },
  { value: "1-2", label: "1 to 2 times" },
  { value: "3-4", label: "3 to 4 times" },
  { value: "5+", label: "5 or more times" },
];

const feedingTypeOptions = [
  { value: "breastfeeding", label: "Exclusive breastfeeding", description: "Only breast milk" },
  { value: "formula", label: "Formula", description: "Infant formula only" },
  { value: "mixed", label: "Mixed", description: "Breast milk + formula" },
  { value: "solids", label: "Solids introduced", description: "Already started solid foods" },
];

const bedtimeOptions = [
  { value: "before-19", label: "Before 7 PM" },
  { value: "19-20", label: "Between 7 PM and 8 PM" },
  { value: "20-21", label: "Between 8 PM and 9 PM" },
  { value: "21-22", label: "Between 9 PM and 10 PM" },
  { value: "after-22", label: "After 10 PM" },
  { value: "irregular", label: "No fixed schedule" },
];

const specialConditionOptions = [
  { value: "reflux", label: "Reflux" },
  { value: "colic", label: "Severe colic" },
  { value: "premature", label: "Premature" },
  { value: "allergy", label: "Food allergy" },
  { value: "dermatitis", label: "Dermatitis" },
  { value: "none", label: "None" },
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
        title: "Welcome to Dr. Sleepy! 🌙",
        description: "Your journey to peaceful nights starts now.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return true;
      case 2: return true;
      case 3: return data.parentName.trim().length > 0;
      case 4: return data.isFirstChild !== "";
      case 5: return data.parentExperience !== "";
      case 6: return data.babyName.trim().length > 0;
      case 7: return true;
      case 8: return data.feedingType !== "";
      case 9: return data.sleepLocation !== "";
      case 10: return data.usesPacifier !== "";
      case 11: return data.nightFeedings !== "";
      case 12: return data.usualBedtime !== "";
      case 13: return true;
      case 14: return data.acceptedTerms;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      // Step 1: Welcome
      case 1:
        return (
          <div className="flex flex-col items-center text-center space-y-6">
            <Avatar size="xl" state="idle" />
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-foreground">
                Hello! I am<br />Dr. Sleepy 🌙
              </h1>
              <p className="text-lg text-muted-foreground">
                Your AI-powered baby sleep assistant.
              </p>
            </div>
            <div className="bg-secondary/50 rounded-2xl p-6 max-w-sm">
              <p className="text-foreground">
                I'll help you understand your baby's cry, create sleep routines, 
                and have more peaceful nights for the whole family.
              </p>
            </div>
          </div>
        );

      // Step 2: Benefits
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                What you'll get access to
              </h2>
              <p className="text-muted-foreground mt-2">
                Everything you need for peaceful nights
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

      // Step 3: Parent Name
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Let's get to know each other better
              </h2>
              <p className="text-muted-foreground mt-2">
                What should I call you?
              </p>
            </div>
            <div className="space-y-4">
              <Label htmlFor="parentName" className="text-lg">Your name</Label>
              <Input
                id="parentName"
                placeholder="E.g.: Mary, John..."
                value={data.parentName}
                onChange={(e) => setData({ ...data, parentName: e.target.value })}
                className="h-14 rounded-2xl text-lg"
              />
            </div>
          </div>
        );

      // Step 4: First Child
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Baby className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {data.parentName ? `${data.parentName}, ` : ""}Is this your first child?
              </h2>
              <p className="text-muted-foreground mt-2">
                This helps me personalize the guidance
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
                  Yes, it's my first child
                </Label>
              </div>
              <div
                className="flex items-center space-x-3 p-4 rounded-2xl border-2 border-border hover:border-primary transition-colors cursor-pointer"
                onClick={() => setData({ ...data, isFirstChild: "no" })}
              >
                <RadioGroupItem value="no" id="first-no" />
                <Label htmlFor="first-no" className="text-base cursor-pointer flex-1">
                  No, I have other children
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      // Step 5: Experience
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                What is your experience with babies?
              </h2>
              <p className="text-muted-foreground mt-2">
                So I can adapt the guidance language
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

            {/* Support Network */}
            <div className="pt-4 border-t border-border">
              <p className="text-base font-medium text-foreground mb-3">
                Do you have a support network?
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
                  <Label htmlFor="support-yes" className="cursor-pointer">Yes</Label>
                </div>
                <div
                  className="flex-1 flex items-center justify-center space-x-2 p-3 rounded-xl border-2 border-border hover:border-primary transition-colors cursor-pointer"
                  onClick={() => setData({ ...data, hasSupportNetwork: "no" })}
                >
                  <RadioGroupItem value="no" id="support-no" />
                  <Label htmlFor="support-no" className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Family, friends, or professionals who help with care
              </p>
            </div>

            {/* Main Concerns */}
            <div className="pt-4 border-t border-border">
              <p className="text-base font-medium text-foreground mb-3">
                What are your main concerns? (optional)
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

      // Step 6: Baby Name
      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Now tell me about your baby
              </h2>
              <p className="text-muted-foreground mt-2">
                What do you call your little one?
              </p>
            </div>
            <div className="space-y-4">
              <Label htmlFor="babyName" className="text-lg">Baby's name</Label>
              <Input
                id="babyName"
                placeholder="E.g.: Mary, John..."
                value={data.babyName}
                onChange={(e) => setData({ ...data, babyName: e.target.value })}
                className="h-14 rounded-2xl text-lg"
              />
            </div>
          </div>
        );

      // Step 7: Birth Date
      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                When was {data.babyName || "the baby"} born?
              </h2>
              <p className="text-muted-foreground mt-2">
                This helps me give age-specific advice
              </p>
            </div>
            <div className="space-y-4">
              <Label htmlFor="birthDate" className="text-lg">Date of birth</Label>
              <Input
                id="birthDate"
                type="date"
                value={data.babyBirthDate}
                onChange={(e) => setData({ ...data, babyBirthDate: e.target.value })}
                className="h-14 rounded-2xl text-lg"
              />
              <p className="text-sm text-muted-foreground text-center">
                This field is optional
              </p>
            </div>
          </div>
        );

      // Step 8: Feeding Type
      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                How does {data.babyName || "the baby"} feed?
              </h2>
              <p className="text-muted-foreground mt-2">
                Feeding type influences sleep and advice
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

      // Step 9: Sleep Location
      case 9:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Where does {data.babyName || "the baby"} sleep?
              </h2>
              <p className="text-muted-foreground mt-2">
                Each environment has its particularities
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

      // Step 10: Pacifier
      case 10:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Does {data.babyName || "the baby"} use a pacifier?
              </h2>
              <p className="text-muted-foreground mt-2">
                The pacifier can influence sleep
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
                  Yes, uses a pacifier
                </Label>
              </div>
              <div
                className="flex items-center space-x-3 p-4 rounded-2xl border-2 border-border hover:border-primary transition-colors cursor-pointer"
                onClick={() => setData({ ...data, usesPacifier: "no" })}
              >
                <RadioGroupItem value="no" id="pacifier-no" />
                <Label htmlFor="pacifier-no" className="text-base cursor-pointer flex-1">
                  No, does not use a pacifier
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      // Step 11: Night Feedings
      case 11:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Night feedings
              </h2>
              <p className="text-muted-foreground mt-2">
                How many times does {data.babyName || "the baby"} feed at night?
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

      // Step 12: Usual Bedtime
      case 12:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                What time does {data.babyName || "the baby"} usually go to sleep?
              </h2>
              <p className="text-muted-foreground mt-2">
                Knowing the time helps me calibrate wake windows
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

      // Step 13: Main Challenge
      case 13:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                What is the biggest challenge today?
              </h2>
              <p className="text-muted-foreground mt-2">
                Describe in a few words so I can prioritize what is most urgent
              </p>
            </div>
            <div className="space-y-4">
              <Input
                id="mainChallenge"
                placeholder="E.g.: takes long to fall asleep, wakes 5x per night..."
                value={data.mainChallenge}
                onChange={(e) => setData({ ...data, mainChallenge: e.target.value })}
                className="h-14 rounded-2xl text-lg"
              />
              <p className="text-sm text-muted-foreground text-center">
                This field is optional
              </p>
            </div>
          </div>
        );

      // Step 14: Special Conditions + Terms
      case 14:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Does {data.babyName || "the baby"} have any special condition?
              </h2>
              <p className="text-muted-foreground mt-2">
                This changes sleep and feeding recommendations
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

            {/* Terms of use */}
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
                  I understand that Dr. Sleepy offers <strong>general guidance</strong> and 
                  <strong> does not replace medical advice</strong>. In case of doubts 
                  about my baby's health, I should consult a health professional.
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
    if (currentStep === totalSteps) return loading ? "Saving..." : "Start using";
    return "Next";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Progress */}
      <header className="px-4 py-4">
        <Progress value={progress} className="h-2 rounded-full" />
        <p className="text-sm text-muted-foreground text-center mt-2">
          Step {currentStep} of {totalSteps}
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
              Back
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
