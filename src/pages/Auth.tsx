import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/Avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail } from "lucide-react";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "resend">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "resend") {
        const { data, error } = await supabase.functions.invoke("resend-access", {
          body: { email: email.trim() },
        });
        if (data?.not_found) {
          toast({
            title: "Email not found 😕",
            description: "This email doesn't have an active account. Subscribe to a plan to get access to Dr. Sleepy.",
            variant: "destructive",
          });
          return;
        }
        if (error) throw error;
        toast({
          title: "Email sent! 📧",
          description: "Check your inbox to access Dr. Sleepy.",
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
            <CardTitle>
              {mode === "login" ? "Sign In" : "Resend Access"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Enter your email and password"
                : "Enter your email to receive a new access link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              {mode === "login" && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
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

              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-lg font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : mode === "resend" ? (
                  <Mail className="w-5 h-5 mr-2" />
                ) : null}
                {loading
                  ? "Loading..."
                  : mode === "login"
                  ? "Sign In"
                  : "Send access via email"}
              </Button>
            </form>

            {mode === "login" && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setMode("resend")}
                  className="text-primary hover:underline text-sm font-medium"
                >
                  Can't sign in? Resend access via email
                </button>
              </div>
            )}

            {mode === "resend" && (
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
