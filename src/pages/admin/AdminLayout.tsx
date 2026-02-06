import { Outlet, useNavigate } from "react-router-dom";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useAuthContext } from "@/contexts/AuthContext";
import { Shield, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout() {
  const { isAdmin, loading } = useAdminRole();
  const { loading: authLoading } = useAuthContext();
  const navigate = useNavigate();

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-2xl mb-2">🔒</div>
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <Shield className="w-16 h-16 text-destructive mx-auto" />
          <h1 className="text-xl font-bold text-foreground">Acesso Negado</h1>
          <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
          <Button onClick={() => navigate("/")} variant="outline">
            <Home className="w-4 h-4 mr-2" />
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Admin</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <Home className="w-4 h-4 mr-1" />
            App
          </Button>
        </div>
      </header>
      <main className="px-4 py-6 max-w-4xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
