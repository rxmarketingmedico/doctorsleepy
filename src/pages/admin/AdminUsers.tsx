import { useEffect, useState } from "react";
import { ArrowLeft, Search, Shield, ShieldOff, Trash2, UserCheck, UserX, Calendar, CreditCard, Baby, Phone, LogIn, CircleDot, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  user_id: string;
  parent_name: string | null;
  baby_name: string | null;
  baby_birth_date: string | null;
  created_at: string;
  updated_at: string;
  subscription_status: string | null;
  subscription_plan: string | null;
  subscription_expires_at: string | null;
  onboarding_completed: boolean | null;
  sleep_location: string | null;
  uses_pacifier: boolean | null;
  night_feedings: number | null;
  buyer_phone: string | null;
  last_access_at: string | null;
  hotmart_transaction_id: string | null;
}

interface UserRole {
  user_id: string;
  role: string;
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (rolesRes.error) throw rolesRes.error;

      setUsers(profilesRes.data || []);
      setRoles(rolesRes.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getUserRole = (userId: string) => {
    return roles.find((r) => r.user_id === userId)?.role || "user";
  };

  const toggleAdmin = async (userId: string) => {
    const currentRole = getUserRole(userId);
    try {
      if (currentRole === "admin") {
        await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
        toast({ title: "Admin removed", description: "Administrator permission removed." });
      } else {
        await supabase.from("user_roles").insert({ user_id: userId, role: "admin" as any });
        toast({ title: "Admin added", description: "Administrator permission granted." });
      }
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const toggleAccess = async (userId: string, currentStatus: string | null) => {
    const newStatus = currentStatus === "blocked" ? "pending" : "blocked";
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ subscription_status: newStatus })
        .eq("user_id", userId);
      if (error) throw error;
      toast({
        title: newStatus === "blocked" ? "Access blocked" : "Access granted",
        description: newStatus === "blocked" ? "User blocked successfully." : "User access granted.",
      });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.from("profiles").delete().eq("user_id", userId);
      if (error) throw error;
      toast({ title: "User removed", description: "User profile removed successfully." });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.parent_name?.toLowerCase().includes(q) ?? false) ||
      (u.baby_name?.toLowerCase().includes(q) ?? false) ||
      u.user_id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground">{users.length} registered</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 rounded-xl"
        />
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading...</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((user) => {
            const role = getUserRole(user.user_id);
            const isBlocked = user.subscription_status === "blocked";
            return (
              <Card key={user.id} className="overflow-hidden">
                <Collapsible>
                  <CollapsibleTrigger className="w-full">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="text-left min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            {user.parent_name || "No name"}
                          </p>
                          <span className="text-xs text-muted-foreground">{user.baby_name || "—"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {role === "admin" && <Badge variant="default" className="text-[10px]">Admin</Badge>}
                        <Badge variant={isBlocked ? "destructive" : user.subscription_status === "active" ? "default" : "secondary"} className="text-[10px]">
                          {isBlocked ? "Blocked" : user.subscription_status === "active" ? "Active" : user.subscription_status === "expired" ? "Expired" : "Pending"}
                        </Badge>
                        {user.last_access_at ? (
                          <CircleDot className="w-3 h-3 text-green-500" />
                        ) : (
                          <CircleDot className="w-3 h-3 text-orange-400" />
                        )}
                        <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                      </div>
                    </CardContent>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="px-4 pb-4 pt-0 space-y-3 border-t">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground pt-2">
                        <Baby className="w-3 h-3" />
                        <span>{user.baby_name || "—"}</span>
                        {user.baby_birth_date && (
                          <span className="text-xs">
                            ({new Date(user.baby_birth_date).toLocaleDateString("en-US")})
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          <span>Plan: <span className="text-foreground font-medium">{user.subscription_plan ? user.subscription_plan.charAt(0).toUpperCase() + user.subscription_plan.slice(1) : "—"}</span></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Registered: <span className="text-foreground font-medium">{new Date(user.created_at).toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}</span></span>
                        </div>
                        {user.subscription_expires_at && (
                          <div className="flex items-center gap-1 col-span-2">
                            <Calendar className="w-3 h-3" />
                            <span>Expires: <span className="text-foreground font-medium">{new Date(user.subscription_expires_at).toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}</span></span>
                          </div>
                        )}
                        {user.buyer_phone && (
                          <div className="flex items-center gap-1 col-span-2">
                            <Phone className="w-3 h-3" />
                            <span>Phone: <span className="text-foreground font-medium">{user.buyer_phone}</span></span>
                          </div>
                        )}
                        {user.last_access_at && (
                          <div className="flex items-center gap-1 col-span-2">
                            <LogIn className="w-3 h-3" />
                            <span>Last access: <span className="text-foreground font-medium">{new Date(user.last_access_at).toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}</span></span>
                          </div>
                        )}
                        {user.hotmart_transaction_id && (
                          <div className="flex items-center gap-1 col-span-2">
                            <CreditCard className="w-3 h-3" />
                            <span>Transaction: <span className="text-foreground font-medium text-[10px]">{user.hotmart_transaction_id}</span></span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant={role === "admin" ? "destructive" : "outline"}
                          onClick={() => toggleAdmin(user.user_id)}
                          className="text-xs"
                        >
                          {role === "admin" ? <ShieldOff className="w-3 h-3 mr-1" /> : <Shield className="w-3 h-3 mr-1" />}
                          {role === "admin" ? "Remove Admin" : "Make Admin"}
                        </Button>

                        <Button
                          size="sm"
                          variant={isBlocked ? "default" : "outline"}
                          onClick={() => toggleAccess(user.user_id, user.subscription_status)}
                          className="text-xs"
                        >
                          {isBlocked ? <UserCheck className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />}
                          {isBlocked ? "Unblock" : "Block"}
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="text-xs">
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete user?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. The user's profile will be permanently removed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteUser(user.user_id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
