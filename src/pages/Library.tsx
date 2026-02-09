import { useState } from "react";
import { Search, Clock, Heart, BookOpen, Headphones, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { articles, type Article } from "@/data/library-articles";
import ReactMarkdown from "react-markdown";

const categories = ["Todos", "Sono", "Alimentação", "Rotina", "Bem-estar"];

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["2", "4"]));
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredContent = articles.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-foreground">Biblioteca</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar conteúdo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-2xl"
          />
        </div>

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

        <div className="grid gap-4">
          {filteredContent.map((item) => (
            <Card
              key={item.id}
              className="card-soft overflow-hidden cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98] transition-transform"
              onClick={() => setSelectedArticle(item)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div
                    className={cn(
                      "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
                      item.type === "article" ? "bg-primary/10" : "bg-accent"
                    )}
                  >
                    {item.type === "article" ? (
                      <BookOpen className="w-6 h-6 text-primary" />
                    ) : (
                      <Headphones className="w-6 h-6 text-accent-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground line-clamp-1">
                        {item.title}
                      </h3>
                      <button
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className="flex-shrink-0"
                      >
                        <Heart
                          className={cn(
                            "w-5 h-5 transition-colors",
                            favorites.has(item.id)
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

      {/* Article Detail Sheet */}
      <Sheet open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl overflow-hidden p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="px-5 pt-5 pb-3 border-b border-border/40 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex-1 min-w-0">
                  <SheetTitle className="text-left text-base line-clamp-1">
                    {selectedArticle?.title}
                  </SheetTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedArticle?.duration}
                    </span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {selectedArticle?.category}
                    </span>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                      {selectedArticle?.ageRange}
                    </span>
                  </div>
                </div>
              </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <article className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground prose-blockquote:text-primary prose-blockquote:border-primary/40 prose-a:text-primary">
                <ReactMarkdown>{selectedArticle?.content || ""}</ReactMarkdown>
              </article>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <BottomNav />
    </div>
  );
}
