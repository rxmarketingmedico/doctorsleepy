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
  feeding_type: string | null;
  usual_bedtime: string | null;
  main_challenge: string | null;
  special_conditions: string[] | null;
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
      toast({ title: "Password too short", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Password confirmation doesn't match.", variant: "destructive" });
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: "Password changed!", description: "Your password has been updated successfully." });
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
      return `${days} days`;
    } else if (months < 12) {
      return `${months} ${months === 1 ? "month" : "months"}`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return remainingMonths > 0 
        ? `${years} ${years === 1 ? "year" : "years"} and ${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`
        : `${years} ${years === 1 ? "year" : "years"}`;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto space-y-6">
        <div className="flex flex-col items-center">
          <Avatar size="xl" state="idle" />
          <h2 className="mt-4 text-xl font-bold text-foreground">{profile?.baby_name || "Your baby"}</h2>
          {profile?.baby_birth_date && (
            <p className="text-muted-foreground">{calculateAge(profile.baby_birth_date)}</p>
          )}
        </div>

        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Baby className="w-5 h-5" />Baby info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile?.parent_name && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Parent</span>
                <span className="text-foreground">{profile.parent_name}</span>
              </div>
            )}
            {profile?.sleep_location && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sleep location</span>
                <span className="text-foreground">
                  {profile.sleep_location === "crib" && "Own crib"}
                  {profile.sleep_location === "parents-room" && "Parents' room"}
                  {profile.sleep_location === "co-sleeping" && "Co-sleeping"}
                  {profile.sleep_location === "bassinet" && "Bassinet"}
                </span>
              </div>
            )}
            {profile?.feeding_type && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Feeding</span>
                <span className="text-foreground">
                  {profile.feeding_type === "breastfeeding" && "Exclusive breastfeeding"}
                  {profile.feeding_type === "formula" && "Formula"}
                  {profile.feeding_type === "mixed" && "Mixed"}
                  {profile.feeding_type === "solids" && "Solids introduced"}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Uses pacifier</span>
              <span className="text-foreground">{profile?.uses_pacifier ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Night feedings</span>
              <span className="text-foreground">{profile?.night_feedings || 0}x per night</span>
            </div>
            {profile?.usual_bedtime && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Usual bedtime</span>
                <span className="text-foreground">
                  {profile.usual_bedtime === "before-19" && "Before 7 PM"}
                  {profile.usual_bedtime === "19-20" && "7–8 PM"}
                  {profile.usual_bedtime === "20-21" && "8–9 PM"}
                  {profile.usual_bedtime === "21-22" && "9–10 PM"}
                  {profile.usual_bedtime === "after-22" && "After 10 PM"}
                  {profile.usual_bedtime === "irregular" && "No fixed schedule"}
                </span>
              </div>
            )}
            {profile?.main_challenge && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Main challenge</span>
                <span className="text-foreground">{profile.main_challenge}</span>
              </div>
            )}
            {profile?.special_conditions && profile.special_conditions.length > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Special conditions</span>
                <span className="text-foreground">
                  {profile.special_conditions.map(c => {
                    const labels: Record<string, string> = { reflux: "Reflux", colic: "Colic", premature: "Premature", allergy: "Food allergy", dermatitis: "Dermatitis" };
                    return labels[c] || c;
                  }).join(", ")}
                </span>
              </div>
            )}
            <Button variant="outline" className="w-full mt-4 rounded-xl" onClick={() => navigate("/profile/edit")}>
              Edit information
            </Button>
          </CardContent>
        </Card>

        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Mail className="w-5 h-5" />Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">Email</span>
              <span className="text-foreground">{user?.email}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Lock className="w-5 h-5" />Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <div className="relative">
                <Input id="new-password" type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimum 6 characters" className="h-12 rounded-xl pr-10" />
                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input id="confirm-password" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password" className="h-12 rounded-xl" />
            </div>
            <Button onClick={handleChangePassword} disabled={changingPassword || !newPassword || !confirmPassword} className="w-full h-12 rounded-xl">
              {changingPassword ? "Changing..." : "Change password"}
            </Button>
          </CardContent>
        </Card>

        <SubscriptionManager />

        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Bell className="w-5 h-5" />Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Notifications</p>
                <p className="text-sm text-muted-foreground">Receive reminders</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Night mode</p>
                <p className="text-sm text-muted-foreground">Activate automatically</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Button variant="outline" className="w-full h-14 rounded-2xl text-lg" onClick={() => navigate("/help")}>
          <HelpCircle className="w-5 h-5 mr-2" />Help Center
        </Button>

        {isAdmin && (
          <Button variant="outline" className="w-full h-14 rounded-2xl text-lg" onClick={() => navigate("/admin")}>
            <Shield className="w-5 h-5 mr-2" />Admin Panel
          </Button>
        )}

        <Button variant="outline" className="w-full h-14 rounded-2xl text-lg text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleSignOut}>
          <LogOut className="w-5 h-5 mr-2" />Sign out
        </Button>
      </main>

      <BottomNav />
    </div>
  );
}
