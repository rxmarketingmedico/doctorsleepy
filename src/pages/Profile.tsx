import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Baby, Mail, LogOut, Bell, ChevronRight, Shield, HelpCircle, Lock, Eye, EyeOff } from "lucide-react";
import { useAdminRole } from "@/hooks/useAdminRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar } from "@/components/Avatar";
import { SubscriptionManager } from "@/components/SubscriptionManager";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  baby_name: string | null;
  baby_birth_date: string | null;
  parent_name: string | null;
  sleep_location: string | null;
  uses_pacifier: boolean | null;
  night_feedings: number | null;
  subscription_status: string | null;
}

export default function Profile() {
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const { isAdmin } = useAdminRole();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles_safe" as any)
          .select("baby_name, baby_birth_date, parent_name, sleep_location, uses_pacifier, night_feedings, subscription_status")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;
        setProfile(data as unknown as ProfileData | null);
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

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast({ title: "Senha muito curta", description: "A senha deve ter pelo menos 6 caracteres.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Senhas não coincidem", description: "A confirmação de senha não confere.", variant: "destructive" });
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: "Senha alterada!", description: "Sua senha foi atualizada com sucesso." });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setChangingPassword(false);
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
          <CardContent className="space-y-3">
            {profile?.parent_name && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Responsável</span>
                <span className="text-foreground">{profile.parent_name}</span>
              </div>
            )}
            {profile?.sleep_location && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Local de sono</span>
                <span className="text-foreground">
                  {profile.sleep_location === "crib" && "Berço próprio"}
                  {profile.sleep_location === "parents-room" && "Quarto dos pais"}
                  {profile.sleep_location === "co-sleeping" && "Cama compartilhada"}
                  {profile.sleep_location === "bassinet" && "Moisés"}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Usa chupeta</span>
              <span className="text-foreground">{profile?.uses_pacifier ? "Sim" : "Não"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Mamadas noturnas</span>
              <span className="text-foreground">{profile?.night_feedings || 0}x por noite</span>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4 rounded-xl"
              onClick={() => navigate("/profile/edit")}
            >
              Editar informações
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

        {/* Change Password Card */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Alterar Senha
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="h-12 rounded-xl pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar nova senha</Label>
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                className="h-12 rounded-xl"
              />
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={changingPassword || !newPassword || !confirmPassword}
              className="w-full h-12 rounded-xl"
            >
              {changingPassword ? "Alterando..." : "Alterar senha"}
            </Button>
          </CardContent>
        </Card>

        {/* Subscription Manager */}
        <SubscriptionManager />

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

        {/* Help Link */}
        <Button
          variant="outline"
          className="w-full h-14 rounded-2xl text-lg"
          onClick={() => navigate("/help")}
        >
          <HelpCircle className="w-5 h-5 mr-2" />
          Central de Ajuda
        </Button>

        {/* Admin Link */}
        {isAdmin && (
          <Button
            variant="outline"
            className="w-full h-14 rounded-2xl text-lg"
            onClick={() => navigate("/admin")}
          >
            <Shield className="w-5 h-5 mr-2" />
            Painel Administrativo
          </Button>
        )}

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
