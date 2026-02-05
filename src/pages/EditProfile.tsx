import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Baby, MapPin, Moon, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileData {
  baby_name: string;
  baby_birth_date: string;
  parent_name: string;
  sleep_location: string;
  uses_pacifier: boolean;
  night_feedings: number;
}

export default function EditProfile() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    baby_name: "",
    baby_birth_date: "",
    parent_name: "",
    sleep_location: "",
    uses_pacifier: false,
    night_feedings: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("baby_name, baby_birth_date, parent_name, sleep_location, uses_pacifier, night_feedings")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setProfile({
            baby_name: data.baby_name || "",
            baby_birth_date: data.baby_birth_date || "",
            parent_name: data.parent_name || "",
            sleep_location: data.sleep_location || "",
            uses_pacifier: data.uses_pacifier || false,
            night_feedings: data.night_feedings || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          baby_name: profile.baby_name || null,
          baby_birth_date: profile.baby_birth_date || null,
          parent_name: profile.parent_name || null,
          sleep_location: profile.sleep_location || null,
          uses_pacifier: profile.uses_pacifier,
          night_feedings: profile.night_feedings,
        })
        .eq("user_id", user.id);

      if (error) throw error;
      
      toast.success("Perfil atualizado com sucesso!");
      navigate("/profile");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Erro ao salvar perfil");
    } finally {
      setSaving(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return "";
    const birth = new Date(birthDate);
    const now = new Date();
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth();
    
    if (months < 1) {
      const days = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
      return `${days} dias`;
    } else if (months < 12) {
      return `${months} ${months === 1 ? "mês" : "meses"}`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return remainingMonths > 0 
        ? `${years} ${years === 1 ? "ano" : "anos"} e ${remainingMonths} ${remainingMonths === 1 ? "mês" : "meses"}`
        : `${years} ${years === 1 ? "ano" : "anos"}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-foreground">Editar Perfil</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            disabled={saving}
            className="rounded-full"
          >
            <Save className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Baby Info */}
        <Card className="card-soft">
          <CardContent className="pt-6 space-y-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Baby className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Dados do Bebê</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="baby_name">Nome do bebê</Label>
              <Input
                id="baby_name"
                value={profile.baby_name}
                onChange={(e) => setProfile({ ...profile, baby_name: e.target.value })}
                placeholder="Digite o nome do bebê"
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="baby_birth_date">Data de nascimento</Label>
              <Input
                id="baby_birth_date"
                type="date"
                value={profile.baby_birth_date}
                onChange={(e) => setProfile({ ...profile, baby_birth_date: e.target.value })}
                className="h-12 rounded-xl"
              />
              {profile.baby_birth_date && (
                <p className="text-sm text-muted-foreground">
                  Idade atual: {calculateAge(profile.baby_birth_date)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_name">Seu nome</Label>
              <Input
                id="parent_name"
                value={profile.parent_name}
                onChange={(e) => setProfile({ ...profile, parent_name: e.target.value })}
                placeholder="Como você gostaria de ser chamado(a)"
                className="h-12 rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sleep Info */}
        <Card className="card-soft">
          <CardContent className="pt-6 space-y-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center">
                <Moon className="w-5 h-5 text-secondary-foreground" />
              </div>
              <h2 className="text-lg font-semibold">Informações de Sono</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sleep_location">Onde o bebê dorme</Label>
              <Select
                value={profile.sleep_location}
                onValueChange={(value) => setProfile({ ...profile, sleep_location: value })}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Selecione o local" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crib">Berço próprio</SelectItem>
                  <SelectItem value="parents-room">Quarto dos pais</SelectItem>
                  <SelectItem value="co-sleeping">Cama compartilhada</SelectItem>
                  <SelectItem value="bassinet">Moisés</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <Label>Usa chupeta</Label>
                <p className="text-sm text-muted-foreground">O bebê usa chupeta para dormir?</p>
              </div>
              <Switch
                checked={profile.uses_pacifier}
                onCheckedChange={(checked) => setProfile({ ...profile, uses_pacifier: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="night_feedings">Mamadas noturnas</Label>
              <Select
                value={profile.night_feedings.toString()}
                onValueChange={(value) => setProfile({ ...profile, night_feedings: parseInt(value) })}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Quantas vezes mama à noite" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Nenhuma</SelectItem>
                  <SelectItem value="1">1 vez</SelectItem>
                  <SelectItem value="2">2 vezes</SelectItem>
                  <SelectItem value="3">3 vezes</SelectItem>
                  <SelectItem value="4">4 vezes</SelectItem>
                  <SelectItem value="5">5 ou mais vezes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-14 rounded-2xl text-lg"
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </main>
    </div>
  );
}
