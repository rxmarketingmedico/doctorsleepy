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
          throw new Error("Passwords do not match.");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters.");
        }
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        toast({
          title: "Password updated! ✅",
          description: "Your new password has been saved successfully.",
        });
        navigate("/");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        toast({
          title: "Email sent! 📧",
          description: "Check your inbox to reset your password.",
        });
        setMode("login");
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "login": return "Sign In";
      case "forgot": return "Reset Password";
      case "reset": return "New Password";
    }
  };

  const getDescription = () => {
    switch (mode) {
      case "login": return "Enter your email and password";
      case "forgot": return "Enter your email to receive a reset link";
      case "reset": return "Enter your new password below";
    }
  };

  const getButtonLabel = () => {
    if (loading) return "Loading...";
    switch (mode) {
      case "login": return "Sign In";
      case "forgot": return "Send reset link";
      case "reset": return "Save new password";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Avatar size="lg" state="idle" />
          <h1 className="mt-4 text-3xl font-bold text-foreground">Dr. Sleepy</h1>
          <p className="text-muted-foreground text-center mt-2">
            Your assistant for peaceful nights
          </p>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle>{getTitle()}</CardTitle>
            <CardDescription>{getDescription()}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode !== "reset" && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
              )}

              {(mode === "login" || mode === "reset") && (
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {mode === "reset" ? "New password" : "Password"}
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

              {mode === "reset" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
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
                  Forgot my password
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
                  Back to login
                </button>
              </div>
            )}

            {mode === "login" && (
              <div className="mt-6 p-3 rounded-xl bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">
                  Don't have an account yet? Subscribe to a plan to get access.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/vendas")}
                  className="text-primary hover:underline text-sm font-medium mt-1"
                >
                  View available plans
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
