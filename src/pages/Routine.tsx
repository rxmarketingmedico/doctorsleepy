import { useState } from "react";
import { Moon, Sun, Baby, Plus, Droplets, Clock, X, Sparkles, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar } from "@/components/Avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const logTypes = [
  { value: "sleep", label: "Sono noturno", icon: Moon, color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" },
  { value: "nap", label: "Soneca", icon: Sun, color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" },
  { value: "feeding", label: "Mamada", icon: Baby, color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400" },
  { value: "diaper", label: "Troca de fralda", icon: Droplets, color: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400" },
];

export default function Routine() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState(format(new Date(), "HH:mm"));
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const queryClient = useQueryClient();

  // Fetch today's logs
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: logs, isLoading } = useQuery({
    queryKey: ["sleep-logs", format(today, "yyyy-MM-dd")],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data, error } = await supabase
        .from("sleep_logs")
        .select("*")
        .eq("user_id", session.user.id)
        .gte("created_at", today.toISOString())
        .order("started_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createLog = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Não autenticado");

      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const startedAt = new Date(`${dateStr}T${startTime}:00`);
      const endedAt = endTime ? new Date(`${dateStr}T${endTime}:00`) : null;

      const { error } = await supabase.from("sleep_logs").insert({
        user_id: session.user.id,
        log_type: selectedType,
        started_at: startedAt.toISOString(),
        ended_at: endedAt?.toISOString() || null,
        notes: notes || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sleep-logs"] });
      toast.success("Evento registrado! O Doutor Soneca já está mais inteligente 🧠");
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao registrar evento");
    },
  });

  const resetForm = () => {
    setSelectedType("");
    setSelectedDate(new Date());
    setStartTime(format(new Date(), "HH:mm"));
    setEndTime("");
    setNotes("");
  };

  const handleSubmit = () => {
    if (!selectedType) {
      toast.error("Selecione o tipo de evento");
      return;
    }
    createLog.mutate();
  };

  const getLogIcon = (type: string) => {
    const logType = logTypes.find(lt => lt.value === type);
    if (!logType) return <Clock className="w-4 h-4" />;
    const Icon = logType.icon;
    return <Icon className="w-4 h-4" />;
  };

  const getLogColor = (type: string) => {
    const logType = logTypes.find(lt => lt.value === type);
    return logType?.color || "bg-muted text-muted-foreground";
  };

  const getLogLabel = (type: string) => {
    const logType = logTypes.find(lt => lt.value === type);
    return logType?.label || type;
  };

  const formatDuration = (start: string, end: string | null) => {
    if (!end) return null;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${minutes}min`;
    return `${minutes}min`;
  };

  // Calculate stats from logs
  const stats = {
    totalSleep: logs?.filter(l => l.log_type === "sleep" || l.log_type === "nap")
      .reduce((acc, l) => {
        if (!l.ended_at) return acc;
        const diffMs = new Date(l.ended_at).getTime() - new Date(l.started_at).getTime();
        return acc + diffMs;
      }, 0) || 0,
    feedings: logs?.filter(l => l.log_type === "feeding").length || 0,
    diapers: logs?.filter(l => l.log_type === "diaper").length || 0,
    events: logs?.length || 0,
  };

  const formatTotalSleep = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}min`;
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
        {/* AI Context Banner */}
        <div className="flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/20 p-3">
          <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Quanto mais você registrar, melhor o Doutor Soneca te orienta!</span> Ele analisa os últimos 7 dias para dar conselhos personalizados.
          </p>
        </div>

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
              <p className="text-2xl font-bold text-foreground">{formatTotalSleep(stats.totalSleep)}</p>
            </CardContent>
          </Card>

          <Card className="card-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Eventos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{stats.events}</p>
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

          <Card className="card-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Trocas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{stats.diapers}</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Log Button */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full h-14 rounded-2xl text-lg font-semibold">
              <Plus className="w-5 h-5 mr-2" />
              Registrar evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Novo registro</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Type Selection */}
              <div className="space-y-3">
                <Label>Tipo de evento</Label>
                <div className="grid grid-cols-2 gap-3">
                  {logTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setSelectedType(type.value)}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          selectedType === type.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className={`p-2 rounded-full ${type.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-sm">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Picker */}
              <div className="space-y-2">
                <Label>Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Início</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Fim (opcional)</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Alguma observação sobre este evento..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!selectedType || createLog.isPending}
                className="w-full h-12 rounded-xl"
              >
                {createLog.isPending ? "Salvando..." : "Salvar registro"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Timeline */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg">
              Histórico de {format(today, "dd 'de' MMMM", { locale: ptBR })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-24" />
                      <div className="h-3 bg-muted rounded w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : logs && logs.length > 0 ? (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                  >
                    <div className={`p-2 rounded-full ${getLogColor(log.log_type)}`}>
                      {getLogIcon(log.log_type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {getLogLabel(log.log_type)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(log.started_at), "HH:mm")}
                        {log.ended_at && ` - ${format(new Date(log.ended_at), "HH:mm")}`}
                        {log.ended_at && ` • ${formatDuration(log.started_at, log.ended_at)}`}
                      </p>
                      {log.notes && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          {log.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum registro hoje</p>
                <p className="text-sm mt-1">Comece registrando o primeiro evento!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
