import { useState } from "react";
import { Search, Package, Monitor, Calendar, ShoppingCart, ArrowRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";

interface SearchResult {
  id: string;
  type: "booth" | "equipment" | "event" | "consumable";
  title: string;
  subtitle: string;
  status?: string;
}

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const allResults: SearchResult[] = [
    { id: "1", type: "booth", title: "Стойка C3", subtitle: "Ноутбук #15, Brother #5", status: "Активна" },
    { id: "2", type: "booth", title: "Стойка D7", subtitle: "Ноутбук #8, Godex #3", status: "Активна" },
    { id: "3", type: "equipment", title: "Ноутбук #15", subtitle: "Dell Latitude 5420", status: "Используется" },
    { id: "4", type: "equipment", title: "Brother #5", subtitle: "QL-820NWB", status: "Используется" },
    { id: "5", type: "event", title: "TechExpo Moscow 2025", subtitle: "15-18 марта, Крокус Экспо", status: "Активно" },
    { id: "6", type: "consumable", title: "Brother Ribbon Black", subtitle: "45 шт в наличии", status: "В наличии" },
  ];

  const filteredResults = allResults.filter((result) => {
    const matchesQuery = result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        result.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || result.type === filter;
    return matchesQuery && matchesFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "booth": return <Package className="h-4 w-4 text-primary" />;
      case "equipment": return <Monitor className="h-4 w-4 text-primary" />;
      case "event": return <Calendar className="h-4 w-4 text-primary" />;
      case "consumable": return <ShoppingCart className="h-4 w-4 text-primary" />;
      default: return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "booth": return "Стойка";
      case "equipment": return "Оборудование";
      case "event": return "Событие";
      case "consumable": return "Расходник";
      default: return "";
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="mb-2">Поиск</h2>
        <p className="text-sm text-muted-foreground">Найдите стойки, оборудование или события</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Поиск..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="booth">Стойки</TabsTrigger>
          <TabsTrigger value="equipment">Оборуд.</TabsTrigger>
          <TabsTrigger value="event">События</TabsTrigger>
          <TabsTrigger value="consumable">Расх.</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        {filteredResults.length === 0 ? (
          <Card className="border-border/40 bg-card/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Ничего не найдено</p>
            </CardContent>
          </Card>
        ) : (
          filteredResults.map((result) => (
            <Card
              key={result.id}
              className="cursor-pointer border-border/40 bg-card/50 transition-all hover:border-primary/50 hover:bg-card/80"
            >
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-md bg-primary/10 p-2">
                  {getIcon(result.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{result.title}</p>
                    <Badge variant="outline" className="text-xs">
                      {getTypeLabel(result.type)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  {result.status && (
                    <Badge variant="secondary" className="text-xs">
                      {result.status}
                    </Badge>
                  )}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
