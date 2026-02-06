import { useEffect, useState } from "react";
import { ArrowLeft, Search, Shield, ShieldOff, Trash2, UserCheck, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  subscription_status: string | null;
  onboarding_completed: boolean | null;
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
        toast({ title: "Admin removido", description: "Permissão de administrador removida." });
      } else {
        await supabase.from("user_roles").insert({ user_id: userId, role: "admin" as any });
        toast({ title: "Admin adicionado", description: "Permissão de administrador concedida." });
      }
      fetchData();
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
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
        title: newStatus === "blocked" ? "Acesso bloqueado" : "Acesso liberado",
        description: newStatus === "blocked" ? "Usuário bloqueado com sucesso." : "Acesso do usuário liberado.",
      });
      fetchData();
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Delete profile (cascade will handle related data)
      const { error } = await supabase.from("profiles").delete().eq("user_id", userId);
      if (error) throw error;
      toast({ title: "Usuário removido", description: "Perfil do usuário removido com sucesso." });
      fetchData();
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
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
          <h1 className="text-xl font-bold text-foreground">Usuários</h1>
          <p className="text-sm text-muted-foreground">{users.length} cadastrados</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 rounded-xl"
        />
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Carregando...</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((user) => {
            const role = getUserRole(user.user_id);
            const isBlocked = user.subscription_status === "blocked";
            return (
              <Card key={user.id} className="overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">
                        {user.parent_name || "Sem nome"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Bebê: {user.baby_name || "—"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Cadastro: {new Date(user.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {role === "admin" && <Badge variant="default">Admin</Badge>}
                      <Badge variant={isBlocked ? "destructive" : user.subscription_status === "active" ? "default" : "secondary"}>
                        {isBlocked ? "Bloqueado" : user.subscription_status === "active" ? "Ativo" : "Pendente"}
                      </Badge>
                      {user.onboarding_completed && (
                        <Badge variant="outline" className="text-xs">Onboarding ✓</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant={role === "admin" ? "destructive" : "outline"}
                      onClick={() => toggleAdmin(user.user_id)}
                      className="text-xs"
                    >
                      {role === "admin" ? <ShieldOff className="w-3 h-3 mr-1" /> : <Shield className="w-3 h-3 mr-1" />}
                      {role === "admin" ? "Remover Admin" : "Tornar Admin"}
                    </Button>

                    <Button
                      size="sm"
                      variant={isBlocked ? "default" : "outline"}
                      onClick={() => toggleAccess(user.user_id, user.subscription_status)}
                      className="text-xs"
                    >
                      {isBlocked ? <UserCheck className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />}
                      {isBlocked ? "Liberar" : "Bloquear"}
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" className="text-xs">
                          <Trash2 className="w-3 h-3 mr-1" />
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. O perfil do usuário será removido permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteUser(user.user_id)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
