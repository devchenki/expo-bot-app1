import { useState } from "react";
import { Clock, Package, ShoppingCart, Monitor, Trash2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";

interface HistoryItem {
  id: number;
  type: "installation" | "consumable" | "equipment" | "archive";
  user: string;
  action: string;
  target: string;
  time: string;
  date: string;
}

export function HistoryPage() {
  const [filter, setFilter] = useState("all");

  const historyItems: HistoryItem[] = [
    { id: 1, type: "installation", user: "ИП", action: "создал установку", target: "Стойка C3", time: "10:30", date: "Сегодня" },
    { id: 2, type: "equipment", user: "АС", action: "вернул ноутбук", target: "#15", time: "10:15", date: "Сегодня" },
    { id: 3, type: "consumable", user: "МП", action: "списал расходник", target: "Brother Ribbon (-5)", time: "09:45", date: "Сегодня" },
    { id: 4, type: "installation", user: "ДК", action: "завершил установку", target: "Стойка D7", time: "09:20", date: "Сегодня" },
    { id: 5, type: "equipment", user: "ИП", action: "назначил принтер", target: "Brother #5 → C3", time: "09:00", date: "Сегодня" },
    { id: 6, type: "consumable", user: "АС", action: "добавил расходники", target: "Godex Ribbon (+10)", time: "16:30", date: "Вчера" },
    { id: 7, type: "archive", user: "МП", action: "архивировал событие", target: "Innovation Summit", time: "15:45", date: "Вчера" },
    { id: 8, type: "installation", user: "ДК", action: "создал установку", target: "Стойка E12", time: "14:20", date: "Вчера" },
    { id: 9, type: "equipment", user: "ИП", action: "отправил на обслуживание", target: "Ноутбук #3", time: "13:10", date: "Вчера" },
    { id: 10, type: "consumable", user: "АС", action: "списал расходник", target: "Brother Labels (-3)", time: "12:00", date: "Вчера" },
  ];

  const filteredItems = historyItems.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "installation": return <Package className="h-3.5 w-3.5 text-primary" />;
      case "consumable": return <ShoppingCart className="h-3.5 w-3.5 text-primary" />;
      case "equipment": return <Monitor className="h-3.5 w-3.5 text-primary" />;
      case "archive": return <Trash2 className="h-3.5 w-3.5 text-primary" />;
      default: return <Clock className="h-3.5 w-3.5 text-primary" />;
    }
  };

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = [];
    }
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, HistoryItem[]>);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="mb-2">История изменений</h2>
        <p className="text-sm text-muted-foreground">Все действия в системе</p>
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="installation">
            <Package className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="consumable">
            <ShoppingCart className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="equipment">
            <Monitor className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="archive">
            <Trash2 className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {Object.entries(groupedItems).map(([date, items]) => (
          <div key={date}>
            <div className="mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">{date}</h3>
            </div>
            <Card className="border-border/40 bg-card/50">
              <CardContent className="p-0">
                {items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-start gap-3 p-4">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-xs text-primary">
                          {item.user}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">{item.user}</span>{" "}
                          <span className="text-muted-foreground">{item.action}</span>{" "}
                          <span className="font-medium">{item.target}</span>
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="rounded bg-primary/10 p-1">
                            {getIcon(item.type)}
                          </div>
                          <p className="text-xs text-muted-foreground">{item.time}</p>
                        </div>
                      </div>
                    </div>
                    {index < items.length - 1 && <Separator className="bg-border/40" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
