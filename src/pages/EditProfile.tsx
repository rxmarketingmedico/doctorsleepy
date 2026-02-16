import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Baby, Moon, Utensils, Clock, AlertTriangle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  feeding_type: string;
  usual_bedtime: string;
  main_challenge: string;
  special_conditions: string[];
}

const specialConditionOptions = [
  { value: "reflux", label: "Reflux" },
  { value: "colic", label: "Severe colic" },
  { value: "premature", label: "Premature" },
  { value: "allergy", label: "Food allergy" },
  { value: "dermatitis", label: "Dermatitis" },
];

export default function EditProfile() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    baby_name: "", baby_birth_date: "", parent_name: "", sleep_location: "",
    uses_pacifier: false, night_feedings: 0, feeding_type: "", usual_bedtime: "",
    main_challenge: "", special_conditions: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("profiles_safe" as any)
          .select("baby_name, baby_birth_date, parent_name, sleep_location, uses_pacifier, night_feedings, feeding_type, usual_bedtime, main_challenge, special_conditions")
          .eq("user_id", user.id)
          .maybeSingle();
        if (error) throw error;
        const profileData = data as unknown as Record<string, any> | null;
        if (profileData) {
          setProfile({
            baby_name: profileData.baby_name || "", baby_birth_date: profileData.baby_birth_date || "",
            parent_name: profileData.parent_name || "", sleep_location: profileData.sleep_location || "",
            uses_pacifier: profileData.uses_pacifier || false, night_feedings: profileData.night_feedings || 0,
            feeding_type: profileData.feeding_type || "", usual_bedtime: profileData.usual_bedtime || "",
            main_challenge: profileData.main_challenge || "", special_conditions: profileData.special_conditions || [],
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Error loading profile");
      } finally { setLoading(false); }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").update({
        baby_name: profile.baby_name || null, baby_birth_date: profile.baby_birth_date || null,
        parent_name: profile.parent_name || null, sleep_location: profile.sleep_location || null,
        uses_pacifier: profile.uses_pacifier, night_feedings: profile.night_feedings,
        feeding_type: profile.feeding_type || null, usual_bedtime: profile.usual_bedtime || null,
        main_challenge: profile.main_challenge || null, special_conditions: profile.special_conditions,
      }).eq("user_id", user.id);
      if (error) throw error;
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Error saving profile");
    } finally { setSaving(false); }
  };

  const toggleCondition = (value: string) => {
    setProfile(prev => ({
      ...prev,
      special_conditions: prev.special_conditions.includes(value)
        ? prev.special_conditions.filter(c => c !== value)
        : [...prev.special_conditions, value],
    }));
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return "";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate("/profile")} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-foreground">Edit Profile</h1>
          <Button variant="ghost" size="icon" onClick={handleSave} disabled={saving} className="rounded-full">
            <Save className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto space-y-6 pb-24">
        <Card className="card-soft">
          <CardContent className="pt-6 space-y-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><Baby className="w-5 h-5 text-primary" /></div>
              <h2 className="text-lg font-semibold">Baby Info</h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="baby_name">Baby's name</Label>
              <Input id="baby_name" value={profile.baby_name} onChange={(e) => setProfile({ ...profile, baby_name: e.target.value })} placeholder="Enter baby's name" className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="baby_birth_date">Date of birth</Label>
              <Input id="baby_birth_date" type="date" value={profile.baby_birth_date} onChange={(e) => setProfile({ ...profile, baby_birth_date: e.target.value })} className="h-12 rounded-xl" />
              {profile.baby_birth_date && <p className="text-sm text-muted-foreground">Current age: {calculateAge(profile.baby_birth_date)}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent_name">Your name</Label>
              <Input id="parent_name" value={profile.parent_name} onChange={(e) => setProfile({ ...profile, parent_name: e.target.value })} placeholder="What would you like to be called" className="h-12 rounded-xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-soft">
          <CardContent className="pt-6 space-y-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/50 flex items-center justify-center"><Utensils className="w-5 h-5 text-accent-foreground" /></div>
              <h2 className="text-lg font-semibold">Feeding</h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feeding_type">Feeding type</Label>
              <Select value={profile.feeding_type} onValueChange={(value) => setProfile({ ...profile, feeding_type: value })}>
                <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="breastfeeding">Exclusive breastfeeding</SelectItem>
                  <SelectItem value="formula">Formula</SelectItem>
                  <SelectItem value="mixed">Mixed (breast + formula)</SelectItem>
                  <SelectItem value="solids">Solids introduced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="night_feedings">Night feedings</Label>
              <Select value={profile.night_feedings.toString()} onValueChange={(value) => setProfile({ ...profile, night_feedings: parseInt(value) })}>
                <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="How many times per night" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None</SelectItem>
                  <SelectItem value="1">1 time</SelectItem>
                  <SelectItem value="2">2 times</SelectItem>
                  <SelectItem value="3">3 times</SelectItem>
                  <SelectItem value="4">4 times</SelectItem>
                  <SelectItem value="5">5 or more times</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="card-soft">
          <CardContent className="pt-6 space-y-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center"><Moon className="w-5 h-5 text-secondary-foreground" /></div>
              <h2 className="text-lg font-semibold">Sleep Info</h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sleep_location">Where baby sleeps</Label>
              <Select value={profile.sleep_location} onValueChange={(value) => setProfile({ ...profile, sleep_location: value })}>
                <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select location" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="crib">Own crib</SelectItem>
                  <SelectItem value="parents-room">Parents' room</SelectItem>
                  <SelectItem value="co-sleeping">Co-sleeping</SelectItem>
                  <SelectItem value="bassinet">Bassinet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <Label>Uses pacifier</Label>
                <p className="text-sm text-muted-foreground">Does baby use a pacifier to sleep?</p>
              </div>
              <Switch checked={profile.uses_pacifier} onCheckedChange={(checked) => setProfile({ ...profile, uses_pacifier: checked })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="usual_bedtime">Usual bedtime</Label>
              <Select value={profile.usual_bedtime} onValueChange={(value) => setProfile({ ...profile, usual_bedtime: value })}>
                <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="What time does baby usually sleep" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="before-19">Before 7 PM</SelectItem>
                  <SelectItem value="19-20">7–8 PM</SelectItem>
                  <SelectItem value="20-21">8–9 PM</SelectItem>
                  <SelectItem value="21-22">9–10 PM</SelectItem>
                  <SelectItem value="after-22">After 10 PM</SelectItem>
                  <SelectItem value="irregular">No fixed schedule</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="card-soft">
          <CardContent className="pt-6 space-y-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><Heart className="w-5 h-5 text-primary" /></div>
              <h2 className="text-lg font-semibold">Challenges & Conditions</h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="main_challenge">Main current challenge</Label>
              <Input id="main_challenge" value={profile.main_challenge} onChange={(e) => setProfile({ ...profile, main_challenge: e.target.value })} placeholder="E.g.: takes long to fall asleep, wakes 5x per night..." className="h-12 rounded-xl" />
              <p className="text-xs text-muted-foreground">AI will prioritize this topic in guidance</p>
            </div>
            <div className="space-y-3">
              <Label>Baby's special conditions</Label>
              <div className="flex flex-wrap gap-2">
                {specialConditionOptions.map((condition) => (
                  <button key={condition.value} type="button" onClick={() => toggleCondition(condition.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      profile.special_conditions.includes(condition.value) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}>
                    {condition.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={saving} className="w-full h-14 rounded-2xl text-lg">
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </main>
    </div>
  );
}
