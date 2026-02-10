import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/Avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "forgot" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Detect password recovery event from Supabase
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("reset");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "reset") {
        if (password !== confirmPassword) {
          throw new Error("As senhas não coincidem.");
        }
        if (password.length < 6) {
          throw new Error("A senha deve ter no mínimo 6 caracteres.");
        }
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        toast({
          title: "Senha atualizada! ✅",
          description: "Sua nova senha foi salva com sucesso.",
        });
        navigate("/");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        toast({
          title: "Email enviado! 📧",
          description: "Verifique sua caixa de entrada para redefinir sua senha.",
        });
        setMode("login");
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "login": return "Entrar";
      case "forgot": return "Recuperar senha";
      case "reset": return "Nova senha";
    }
  };

  const getDescription = () => {
    switch (mode) {
      case "login": return "Entre com seu email e senha";
      case "forgot": return "Informe seu email para receber um link de redefinição";
      case "reset": return "Digite sua nova senha abaixo";
    }
  };

  const getButtonLabel = () => {
    if (loading) return "Carregando...";
    switch (mode) {
      case "login": return "Entrar";
      case "forgot": return "Enviar link de recuperação";
      case "reset": return "Salvar nova senha";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Avatar and Title */}
        <div className="flex flex-col items-center mb-8">
          <Avatar size="lg" state="idle" />
          <h1 className="mt-4 text-3xl font-bold text-foreground">Doutor Soneca</h1>
          <p className="text-muted-foreground text-center mt-2">
            Seu assistente para noites tranquilas
          </p>
        </div>

        {/* Auth Card */}
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle>{getTitle()}</CardTitle>
            <CardDescription>{getDescription()}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email field - shown for login, signup, forgot */}
              {mode !== "reset" && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
              )}

              {/* Password field - shown for login, signup, reset */}
              {(mode === "login" || mode === "reset") && (
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {mode === "reset" ? "Nova senha" : "Senha"}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-12 rounded-xl"
                  />
                </div>
              )}

              {/* Confirm password - only for reset */}
              {mode === "reset" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-12 rounded-xl"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-lg font-semibold"
                disabled={loading}
              >
                {getButtonLabel()}
              </Button>
            </form>

            {mode === "login" && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-primary hover:underline text-sm font-medium"
                >
                  Esqueci minha senha
                </button>
              </div>
            )}

            {mode !== "reset" && mode === "forgot" && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-primary hover:underline text-sm"
                >
                  Voltar para o login
                </button>
              </div>
            )}

            {mode === "login" && (
              <div className="mt-6 p-3 rounded-xl bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">
                  Ainda não tem conta? Assine um plano para ter acesso.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/vendas")}
                  className="text-primary hover:underline text-sm font-medium mt-1"
                >
                  Ver planos disponíveis
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
