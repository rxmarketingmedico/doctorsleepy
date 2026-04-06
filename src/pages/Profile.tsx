import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Baby, Mail, LogOut, Bell, ChevronRight, Shield, HelpCircle, Lock, Eye, EyeOff, Globe } from "lucide-react";
import { useAdminRole } from "@/hooks/useAdminRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar } from "@/components/Avatar";
import { SubscriptionManager } from "@/components/SubscriptionManager";
import { useAuthContext } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Language, languageLabels } from "@/i18n/translations";

interface ProfileData {
  baby_name: string | null;
  baby_birth_date: string | null;
  parent_name: string | null;
  sleep_location: string | null;
  uses_pacifier: boolean | null;
  night_feedings: number | null;
  subscription_status: string | null;
  feeding_type: string | null;
  usual_bedtime: string | null;
  main_challenge: string | null;
  special_conditions: string[] | null;
}

export default function Profile() {
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language, setLanguage } = useLanguage();
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
          .select("baby_name, baby_birth_date, parent_name, sleep_location, uses_pacifier, night_feedings, subscription_status, feeding_type, usual_bedtime, main_challenge, special_conditions")
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
      toast({ title: "Error signing out", description: error.message, variant: "destructive" });
    } else {
      navigate("/auth");
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast({ title: t("password_too_short"), description: t("password_too_short_desc"), variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: t("passwords_dont_match"), description: t("passwords_dont_match_desc"), variant: "destructive" });
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: t("password_changed"), description: t("password_changed_desc") });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
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
      return `${days} ${t("age_days")}`;
    } else if (months < 12) {
      return `${months} ${months === 1 ? t("age_month") : t("age_months")}`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return remainingMonths > 0
        ? `${years} ${years === 1 ? t("age_year") : t("age_years")} ${t("age_and")} ${remainingMonths} ${remainingMonths === 1 ? t("age_month") : t("age_months")}`
        : `${years} ${years === 1 ? t("age_year") : t("age_years")}`;
    }
  };

  const sleepLocationMap: Record<string, string> = {
    crib: t("loc_crib"),
    "parents-room": t("loc_parents_room"),
    "co-sleeping": t("loc_co_sleeping"),
    bassinet: t("loc_bassinet"),
  };

  const feedingMap: Record<string, string> = {
    breastfeeding: t("feed_breastfeeding"),
    formula: t("feed_formula"),
    mixed: t("feed_mixed"),
    solids: t("feed_solids"),
  };

  const bedtimeMap: Record<string, string> = {
    "before-19": t("bed_before_19"),
    "19-20": t("bed_19_20"),
    "20-21": t("bed_20_21"),
    "21-22": t("bed_21_22"),
    "after-22": t("bed_after_22"),
    irregular: t("bed_irregular"),
  };

  const conditionLabels: Record<string, string> = {
    reflux: t("cond_reflux"),
    colic: t("cond_colic"),
    premature: t("cond_premature"),
    allergy: t("cond_allergy"),
    dermatitis: t("cond_dermatitis"),
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-foreground">{t("profile_title")}</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto space-y-6">
        <div className="flex flex-col items-center">
          <Avatar size="xl" state="idle" />
          <h2 className="mt-4 text-xl font-bold text-foreground">{profile?.baby_name || t("profile_your_baby")}</h2>
          {profile?.baby_birth_date && (
            <p className="text-muted-foreground">{calculateAge(profile.baby_birth_date)}</p>
          )}
        </div>

        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Baby className="w-5 h-5" />{t("profile_baby_info")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile?.parent_name && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("profile_parent")}</span>
                <span className="text-foreground">{profile.parent_name}</span>
              </div>
            )}
            {profile?.sleep_location && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("profile_sleep_location")}</span>
                <span className="text-foreground">{sleepLocationMap[profile.sleep_location] || profile.sleep_location}</span>
              </div>
            )}
            {profile?.feeding_type && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("profile_feeding")}</span>
                <span className="text-foreground">{feedingMap[profile.feeding_type] || profile.feeding_type}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("profile_uses_pacifier")}</span>
              <span className="text-foreground">{profile?.uses_pacifier ? t("yes") : t("no")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("profile_night_feedings")}</span>
              <span className="text-foreground">{profile?.night_feedings || 0}x {t("per_night")}</span>
            </div>
            {profile?.usual_bedtime && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("profile_usual_bedtime")}</span>
                <span className="text-foreground">{bedtimeMap[profile.usual_bedtime] || profile.usual_bedtime}</span>
              </div>
            )}
            {profile?.main_challenge && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("profile_main_challenge")}</span>
                <span className="text-foreground">{profile.main_challenge}</span>
              </div>
            )}
            {profile?.special_conditions && profile.special_conditions.length > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("profile_special_conditions")}</span>
                <span className="text-foreground">
                  {profile.special_conditions.map(c => conditionLabels[c] || c).join(", ")}
                </span>
              </div>
            )}
            <Button variant="outline" className="w-full mt-4 rounded-xl" onClick={() => navigate("/profile/edit")}>
              {t("profile_edit_info")}
            </Button>
          </CardContent>
        </Card>

        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Mail className="w-5 h-5" />{t("profile_account")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">{t("profile_email")}</span>
              <span className="text-foreground">{user?.email}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Lock className="w-5 h-5" />{t("profile_change_password")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">{t("profile_new_password")}</Label>
              <div className="relative">
                <Input id="new-password" type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={t("profile_min_chars")} className="h-12 rounded-xl pr-10" />
                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">{t("profile_confirm_password")}</Label>
              <Input id="confirm-password" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t("profile_repeat_password")} className="h-12 rounded-xl" />
            </div>
            <Button onClick={handleChangePassword} disabled={changingPassword || !newPassword || !confirmPassword} className="w-full h-12 rounded-xl">
              {changingPassword ? t("profile_changing") : t("profile_change_btn")}
            </Button>
          </CardContent>
        </Card>

        <SubscriptionManager />

        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Bell className="w-5 h-5" />{t("profile_settings")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{t("profile_language")}</p>
                <p className="text-sm text-muted-foreground">{t("profile_select_language")}</p>
              </div>
              <Select value={language} onValueChange={(val) => setLanguage(val as Language)}>
                <SelectTrigger className="w-[160px] h-10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(languageLabels) as [Language, string][]).map(([code, label]) => (
                    <SelectItem key={code} value={code}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{t("profile_notifications")}</p>
                <p className="text-sm text-muted-foreground">{t("profile_receive_reminders")}</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{t("profile_night_mode")}</p>
                <p className="text-sm text-muted-foreground">{t("profile_auto_activate")}</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Button variant="outline" className="w-full h-14 rounded-2xl text-lg" onClick={() => navigate("/help")}>
          <HelpCircle className="w-5 h-5 mr-2" />{t("profile_help_center")}
        </Button>

        {isAdmin && (
          <Button variant="outline" className="w-full h-14 rounded-2xl text-lg" onClick={() => navigate("/admin")}>
            <Shield className="w-5 h-5 mr-2" />{t("profile_admin_panel")}
          </Button>
        )}

        <Button variant="outline" className="w-full h-14 rounded-2xl text-lg text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleSignOut}>
          <LogOut className="w-5 h-5 mr-2" />{t("profile_sign_out")}
        </Button>
      </main>

      <BottomNav />
    </div>
  );
}
