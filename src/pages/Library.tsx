import { useState } from "react";
import { Search, Clock, Heart, BookOpen, Headphones } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: "article" | "audio";
  duration: string;
  category: string;
  ageRange: string;
  isFavorite: boolean;
}

const mockContent: ContentItem[] = [
  {
    id: "1",
    title: "Janelas de sono por idade",
    description: "Entenda quanto tempo seu bebê deve ficar acordado",
    type: "article",
    duration: "3 min",
    category: "Sono",
    ageRange: "0-3 meses",
    isFavorite: false,
  },
  {
    id: "2",
    title: "Ruído branco: benefícios e cuidados",
    description: "Como usar sons para acalmar o bebê",
    type: "audio",
    duration: "5 min",
    category: "Sono",
    ageRange: "0-6 meses",
    isFavorite: true,
  },
  {
    id: "3",
    title: "Sinais de fome vs cansaço",
    description: "Aprenda a diferenciar os sinais do seu bebê",
    type: "article",
    duration: "4 min",
    category: "Alimentação",
    ageRange: "0-12 meses",
    isFavorite: false,
  },
  {
    id: "4",
    title: "Rotina de sono noturno",
    description: "Passo a passo para criar uma rotina eficaz",
    type: "article",
    duration: "6 min",
    category: "Rotina",
    ageRange: "3-6 meses",
    isFavorite: true,
  },
  {
    id: "5",
    title: "Meditação para pais cansados",
    description: "5 minutos de relaxamento guiado",
    type: "audio",
    duration: "5 min",
    category: "Bem-estar",
    ageRange: "Todos",
    isFavorite: false,
  },
  {
    id: "6",
    title: "Regressão de sono: o que esperar",
    description: "Por que o sono pode piorar temporariamente",
    type: "article",
    duration: "5 min",
    category: "Sono",
    ageRange: "4-6 meses",
    isFavorite: false,
  },
];

const categories = ["Todos", "Sono", "Alimentação", "Rotina", "Bem-estar"];
const ageFilters = ["Todas idades", "0-3 meses", "3-6 meses", "6-12 meses"];

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [content, setContent] = useState<ContentItem[]>(mockContent);

  const toggleFavorite = (id: string) => {
    setContent((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const filteredContent = content.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-foreground">Biblioteca</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar conteúdo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-2xl"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="rounded-full whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid gap-4">
          {filteredContent.map((item) => (
            <Card key={item.id} className="card-soft overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
                    item.type === "article" ? "bg-primary/10" : "bg-accent"
                  )}>
                    {item.type === "article" ? (
                      <BookOpen className="w-6 h-6 text-primary" />
                    ) : (
                      <Headphones className="w-6 h-6 text-accent-foreground" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground line-clamp-1">
                        {item.title}
                      </h3>
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className="flex-shrink-0"
                      >
                        <Heart
                          className={cn(
                            "w-5 h-5 transition-colors",
                            item.isFavorite
                              ? "fill-cry text-cry"
                              : "text-muted-foreground hover:text-cry"
                          )}
                        />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.duration}
                      </span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                        {item.ageRange}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum conteúdo encontrado</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
