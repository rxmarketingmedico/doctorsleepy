import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Audio {
  id: string;
  title: string;
  category: string;
  author: string | null;
  audio_url: string;
  duration_seconds: number | null;
  is_premium: boolean | null;
  play_count: number | null;
}

export default function AdminAudios() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [audios, setAudios] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "lullaby",
    author: "",
    audio_url: "",
    duration_seconds: "",
    is_premium: false,
  });

  const fetchAudios = async () => {
    try {
      const { data, error } = await supabase
        .from("audio_library")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setAudios(data || []);
    } catch (error) {
      console.error("Error fetching audios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAudios(); }, []);

  const handleAdd = async () => {
    if (!form.title || !form.audio_url) {
      toast({ title: "Erro", description: "Título e URL são obrigatórios.", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase.from("audio_library").insert({
        title: form.title,
        category: form.category,
        author: form.author || null,
        audio_url: form.audio_url,
        duration_seconds: form.duration_seconds ? parseInt(form.duration_seconds) : null,
        is_premium: form.is_premium,
      });
      if (error) throw error;
      toast({ title: "Áudio adicionado!" });
      setDialogOpen(false);
      setForm({ title: "", category: "lullaby", author: "", audio_url: "", duration_seconds: "", is_premium: false });
      fetchAudios();
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("audio_library").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Áudio removido!" });
      fetchAudios();
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  const categoryLabels: Record<string, string> = {
    lullaby: "Canção de Ninar",
    story: "História",
    white_noise: "Ruído Branco",
    nature: "Natureza",
    meditation: "Meditação",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Áudios</h1>
            <p className="text-sm text-muted-foreground">{audios.length} no catálogo</p>
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Áudio</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Título *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lullaby">Canção de Ninar</SelectItem>
                    <SelectItem value="story">História</SelectItem>
                    <SelectItem value="white_noise">Ruído Branco</SelectItem>
                    <SelectItem value="nature">Natureza</SelectItem>
                    <SelectItem value="meditation">Meditação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Autor</Label>
                <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>URL do Áudio *</Label>
                <Input value={form.audio_url} onChange={(e) => setForm({ ...form, audio_url: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Duração (segundos)</Label>
                <Input type="number" value={form.duration_seconds} onChange={(e) => setForm({ ...form, duration_seconds: e.target.value })} />
              </div>
              <Button onClick={handleAdd} className="w-full">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Carregando...</p>
      ) : (
        <div className="space-y-3">
          {audios.map((audio) => (
            <Card key={audio.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Music className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{audio.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {categoryLabels[audio.category] || audio.category}
                        {audio.author && ` • ${audio.author}`}
                        {audio.duration_seconds && ` • ${Math.floor(audio.duration_seconds / 60)}min`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {audio.play_count || 0} reproduções
                      </p>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir áudio?</AlertDialogTitle>
                        <AlertDialogDescription>
                          "{audio.title}" será removido permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(audio.id)}>Excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
          {audios.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhum áudio cadastrado.</p>
          )}
        </div>
      )}
    </div>
  );
}
