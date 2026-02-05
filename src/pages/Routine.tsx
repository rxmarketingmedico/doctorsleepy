import { useState } from "react";
import { Moon, Sun, Baby, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar } from "@/components/Avatar";

interface LogEntry {
  id: string;
  type: "sleep" | "wake" | "feeding";
  time: string;
  duration?: string;
}

// Mock data for demonstration
const mockLogs: LogEntry[] = [
  { id: "1", type: "sleep", time: "22:00", duration: "3h" },
  { id: "2", type: "wake", time: "01:00" },
  { id: "3", type: "feeding", time: "01:15" },
  { id: "4", type: "sleep", time: "01:45", duration: "4h" },
  { id: "5", type: "wake", time: "05:45" },
];

const stats = {
  totalSleep: "7h 30min",
  nightWakings: 2,
  feedings: 3,
  longestStretch: "4h",
};

export default function Routine() {
  const [logs] = useState<LogEntry[]>(mockLogs);

  const getLogIcon = (type: string) => {
    switch (type) {
      case "sleep":
        return <Moon className="w-4 h-4" />;
      case "wake":
        return <Sun className="w-4 h-4" />;
      case "feeding":
        return <Baby className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case "sleep":
        return "bg-sleep text-sleep-foreground";
      case "wake":
        return "bg-discomfort text-discomfort-foreground";
      case "feeding":
        return "bg-hunger text-hunger-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-foreground">Rotina</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Avatar Section */}
        <div className="flex justify-center">
          <Avatar size="lg" state="idle" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="card-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sono total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{stats.totalSleep}</p>
            </CardContent>
          </Card>

          <Card className="card-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Maior período
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{stats.longestStretch}</p>
            </CardContent>
          </Card>

          <Card className="card-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Despertares
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{stats.nightWakings}</p>
            </CardContent>
          </Card>

          <Card className="card-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Mamadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{stats.feedings}</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Log Button */}
        <Button className="w-full h-14 rounded-2xl text-lg font-semibold">
          <Plus className="w-5 h-5 mr-2" />
          Registrar evento
        </Button>

        {/* Timeline */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg">Histórico de hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                >
                  <div className={`p-2 rounded-full ${getLogColor(log.type)}`}>
                    {getLogIcon(log.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {log.type === "sleep" && "Dormiu"}
                      {log.type === "wake" && "Acordou"}
                      {log.type === "feeding" && "Mamou"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {log.time}
                      {log.duration && ` • ${log.duration}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
