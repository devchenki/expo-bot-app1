import { Plus, Package, Monitor, Calendar, TrendingUp, Search, ShoppingCart, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface HomePageProps {
  onCreateInstallation: () => void;
  onNavigate?: (page: string) => void;
}

export function HomePage({ onCreateInstallation, onNavigate }: HomePageProps) {
  const recentActivities = [
    { id: 1, user: "ИВ", action: "создал установку", item: "Стойка C3", time: "2 мин назад" },
    { id: 2, user: "АС", action: "вернул ноутбук", item: "#15", time: "15 мин назад" },
    { id: 3, user: "МП", action: "добавил расходники", item: "Brother Ribbon", time: "1 ч назад" },
    { id: 4, user: "ДК", action: "завершил установку", item: "Стойка D7", time: "2 ч назад" },
    { id: 5, user: "ИП", action: "назначил принтер", item: "Brother #5", time: "3 ч назад" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Добро пожаловать!</h2>
        <p className="text-muted-foreground">
          Управляйте оборудованием выставки эффективно
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-border/40 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <div className="rounded-md bg-primary/10 p-1.5">
                <Package className="h-3.5 w-3.5 text-primary" />
              </div>
              Установки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">42</div>
            <p className="text-xs text-muted-foreground">Активных сейчас</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <div className="rounded-md bg-primary/10 p-1.5">
                <Monitor className="h-3.5 w-3.5 text-primary" />
              </div>
              Ноутбуки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">15</div>
            <p className="text-xs text-muted-foreground">Свободных</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm">Быстрые действия</h3>
        <Button onClick={onCreateInstallation} className="w-full shadow-sm" size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Создать установку
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Card 
            className="cursor-pointer border-border/40 bg-card/50 transition-all hover:border-primary/50 hover:bg-card/80"
            onClick={() => onNavigate?.("search")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="mb-2 rounded-lg bg-primary/10 p-2">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <p className="text-center text-xs">Найти стойку</p>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer border-border/40 bg-card/50 transition-all hover:border-primary/50 hover:bg-card/80"
            onClick={() => onNavigate?.("consumables")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="mb-2 rounded-lg bg-primary/10 p-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <p className="text-center text-xs">Расходники</p>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer border-border/40 bg-card/50 transition-all hover:border-primary/50 hover:bg-card/80"
            onClick={() => onNavigate?.("statistics")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="mb-2 rounded-lg bg-primary/10 p-2">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <p className="text-center text-xs">Статистика</p>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer border-border/40 bg-card/50 transition-all hover:border-primary/50 hover:bg-card/80"
            onClick={() => onNavigate?.("events")}
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="mb-2 rounded-lg bg-primary/10 p-2">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <p className="text-center text-xs">Мероприятия</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm">Недавняя активность</h3>
        <Card className="border-border/40 bg-card/50">
          <CardContent className="p-0">
            {recentActivities.map((activity, index) => (
              <div key={activity.id}>
                <div className="flex items-start gap-3 p-4">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-xs text-primary">{activity.user}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium text-foreground">{activity.user}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>{" "}
                      <span className="font-medium text-foreground">{activity.item}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
                {index < recentActivities.length - 1 && <Separator className="bg-border/40" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
