import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Baby, Mail, LogOut, CreditCard, Bell, Moon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar } from "@/components/Avatar";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  baby_name: string | null;
  baby_birth_date: string | null;
  subscription_status: string | null;
}

export default function Profile() {
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("baby_name, baby_birth_date, subscription_status")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  const calculateAge = (birthDate: string) => {
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

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-foreground">Perfil</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Avatar and User Info */}
        <div className="flex flex-col items-center">
          <Avatar size="xl" state="idle" />
          <h2 className="mt-4 text-xl font-bold text-foreground">
            {profile?.baby_name || "Seu bebê"}
          </h2>
          {profile?.baby_birth_date && (
            <p className="text-muted-foreground">
              {calculateAge(profile.baby_birth_date)}
            </p>
          )}
        </div>

        {/* Baby Info Card */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Baby className="w-5 h-5" />
              Dados do bebê
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="ghost" 
              className="w-full justify-between h-auto py-3"
              onClick={() => navigate("/onboarding")}
            >
              <span>Editar informações</span>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </CardContent>
        </Card>

        {/* Account Card */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">Email</span>
              <span className="text-foreground">{user?.email}</span>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Assinatura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-foreground">Plano Premium</p>
                <p className="text-sm text-muted-foreground">R$ 49/mês</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                profile?.subscription_status === "active" 
                  ? "bg-secondary text-secondary-foreground" 
                  : "bg-muted text-muted-foreground"
              }`}>
                {profile?.subscription_status === "active" ? "Ativo" : "Pendente"}
              </span>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-2 rounded-xl"
            >
              Gerenciar assinatura
            </Button>
          </CardContent>
        </Card>

        {/* Settings Card */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Configurações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Notificações</p>
                <p className="text-sm text-muted-foreground">Receber lembretes</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Modo noturno</p>
                <p className="text-sm text-muted-foreground">Ativar automaticamente</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Button
          variant="outline"
          className="w-full h-14 rounded-2xl text-lg text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sair da conta
        </Button>
      </main>

      <BottomNav />
    </div>
  );
}
