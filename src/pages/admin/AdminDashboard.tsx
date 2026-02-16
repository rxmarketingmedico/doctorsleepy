import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Music, Shield, MessageCircle, Moon, CreditCard, LifeBuoy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  totalUsers: number;
  totalAudios: number;
  totalMessages: number;
  totalSleepLogs: number;
  totalPurchases: number;
  totalTickets: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalAudios: 0, totalMessages: 0, totalSleepLogs: 0, totalPurchases: 0, totalTickets: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [profiles, audios, messages, sleepLogs, purchases, tickets] = await Promise.all([
          supabase.from("profiles").select("id", { count: "exact", head: true }),
          supabase.from("audio_library").select("id", { count: "exact", head: true }),
          supabase.from("chat_messages").select("id", { count: "exact", head: true }),
          supabase.from("sleep_logs").select("id", { count: "exact", head: true }),
          supabase.from("pending_activations").select("id", { count: "exact", head: true }),
          supabase.from("support_tickets").select("id", { count: "exact", head: true }),
        ]);

        setStats({
          totalUsers: profiles.count || 0,
          totalAudios: audios.count || 0,
          totalMessages: messages.count || 0,
          totalSleepLogs: sleepLogs.count || 0,
          totalPurchases: purchases.count || 0,
          totalTickets: tickets.count || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { title: "Users", value: stats.totalUsers, icon: Users, route: "/admin/users", color: "text-blue-500" },
    { title: "Audios", value: stats.totalAudios, icon: Music, route: "/admin/audios", color: "text-violet-500" },
    { title: "Messages", value: stats.totalMessages, icon: MessageCircle, route: null, color: "text-emerald-500" },
    { title: "Sleep Logs", value: stats.totalSleepLogs, icon: Moon, route: null, color: "text-indigo-500" },
    { title: "Purchases", value: stats.totalPurchases, icon: CreditCard, route: "/admin/purchases", color: "text-amber-500" },
    { title: "Tickets", value: stats.totalTickets, icon: LifeBuoy, route: "/admin/tickets", color: "text-rose-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {cards.map((card) => (
          <Card
            key={card.title}
            className={`cursor-pointer hover:shadow-lg transition-all ${card.route ? "hover:scale-[1.02]" : ""}`}
            onClick={() => card.route && navigate(card.route)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <card.icon className={`w-8 h-8 ${card.color}`} />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {loading ? "..." : card.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
