import React, { useEffect } from "react";
import { Plus, Package, Monitor, Calendar, TrendingUp, Search, ShoppingCart, BarChart3, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CardSkeleton, ListSkeleton } from "./ui/skeletons";
import { useInstallations } from "../hooks/useInstallations";
import { useEquipment } from "../hooks/useEquipment";
import { useActivity } from "../hooks/useActivity";

interface HomePageProps {
  onCreateInstallation: () => void;
  onNavigate?: (page: string) => void;
}

export function HomePage({ onCreateInstallation, onNavigate }: HomePageProps) {
  const { installations, loading: installationsLoading } = useInstallations();
  const { laptops, loading: equipmentLoading } = useEquipment();
  const { activities: recentActivities, refetch: refetchActivity, loading: activitiesLoading } = useActivity(5);

  const isLoading = installationsLoading || equipmentLoading;
  
  // Обновляем активность при возврате на страницу и периодически
  useEffect(() => {
    // Обновляем при монтировании
    refetchActivity();
    
    // Обновляем при возврате фокуса на страницу
    const handleFocus = () => {
      refetchActivity();
    };
    
    // Обновляем при глобальном событии (после изменений данных)
    const handleActivityUpdate = () => {
      refetchActivity();
    };
    
    // Периодическое обновление каждые 30 секунд
    const interval = setInterval(() => {
      refetchActivity();
    }, 30000);
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('activityNeedsUpdate', handleActivityUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('activityNeedsUpdate', handleActivityUpdate);
    };
  }, [refetchActivity]);
  
  // Вычисляем статистику
  const totalInstallations = installations.length;
  
  // Получаем список ID ноутбуков, которые используются в активных установках
  const occupiedLaptopIds = new Set(
    installations
      .map(inst => inst.laptop)
      .filter(Boolean)
      .map(l => Number(l))
  );
  
  // Считаем свободные ноутбуки: исключаем те, что используются в установках
  const availableLaptops = laptops.filter(l => {
    const isOccupied = occupiedLaptopIds.has(l.id);
    const isUnavailable = l.status?.toLowerCase() === "in-use" || l.status?.toLowerCase() === "maintenance";
    // Ноутбук свободен, если он не занят в установке И не имеет статус in-use/maintenance в БД
    return !isOccupied && !isUnavailable;
  }).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="mb-2">Добро пожаловать!</h2>
          <p className="text-muted-foreground">
            Загрузка данных...
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <ListSkeleton count={3} />
      </div>
    );
  }

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
            <div className="text-2xl">{totalInstallations}</div>
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
            <div className="text-2xl">{availableLaptops}</div>
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
            {recentActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Clock className="mb-3 h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Нет недавней активности</p>
              </div>
            ) : (
              recentActivities.map((activity, index) => (
                <div key={activity.id}>
                  <div className="flex items-start gap-3 p-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage 
                        src={activity.avatar_url || undefined} 
                        alt={activity.user}
                        onError={(e) => {
                          console.warn('Failed to load avatar:', activity.avatar_url, 'for user:', activity.user);
                          // Скрываем изображение при ошибке загрузки, fallback покажется автоматически
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                        onLoad={() => {
                          console.log('Avatar loaded successfully:', activity.avatar_url, 'for user:', activity.user);
                        }}
                      />
                      <AvatarFallback className="bg-primary/10 text-xs text-primary">
                        {activity.user?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
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
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
