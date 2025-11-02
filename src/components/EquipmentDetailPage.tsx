import { useState } from "react";
import { ArrowLeft, Monitor, MapPin, Calendar, User, Printer, Tag, Info, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface EquipmentDetailPageProps {
  onBack: () => void;
  equipmentType?: "laptop" | "brother" | "godex";
  equipmentId?: number;
}

export function EquipmentDetailPage({ 
  onBack, 
  equipmentType = "laptop", 
  equipmentId = 15 
}: EquipmentDetailPageProps) {
  const [historyFilter, setHistoryFilter] = useState("all");

  // Данные для разных типов оборудования
  const equipmentData = {
    laptop: {
      id: equipmentId,
      name: `Ноутбук #${equipmentId}`,
      model: "Dell Latitude 5420",
      serial: "SN12345678",
      mac: "00:1A:2B:3C:4D:5E",
      ip: "192.168.1.15",
      specs: "Intel i5-1145G7, 16GB RAM, 512GB SSD",
      status: "in-use",
      currentLocation: "Стойка C3",
      currentEvent: "TechExpo Moscow 2025",
      totalUsage: 127,
      icon: Monitor,
    },
    brother: {
      id: equipmentId,
      name: `Brother #${equipmentId}`,
      model: "Brother QL-820NWB",
      serial: "BR98765432",
      mac: "00:80:77:31:01:07",
      ip: "192.168.1.105",
      specs: "Термопечать, 62мм, USB/WiFi/Bluetooth",
      status: "in-use",
      currentLocation: "Стойка C3",
      currentEvent: "TechExpo Moscow 2025",
      totalUsage: 89,
      icon: Printer,
    },
    godex: {
      id: equipmentId,
      name: `Godex #${equipmentId}`,
      model: "Godex G500",
      serial: "GX45678901",
      mac: "00:22:58:4A:B2:C3",
      ip: "192.168.1.120",
      specs: "Термотрансфер, 110мм, USB/LAN",
      status: "available",
      currentLocation: "Склад",
      currentEvent: null,
      totalUsage: 64,
      icon: Tag,
    },
  };

  const equipment = equipmentData[equipmentType];
  const Icon = equipment.icon;

  const history = [
    { id: 1, event: "TechExpo Moscow 2025", booth: "C3", date: "2 ноя 2025", user: "ИП", duration: "3 дня", status: "active" },
    { id: 2, event: "Digital Forum", booth: "D7", date: "28 окт 2025", user: "АС", duration: "2 дня", status: "completed" },
    { id: 3, event: "Innovation Summit", booth: "E12", date: "20 окт 2025", user: "МП", duration: "4 дня", status: "completed" },
    { id: 4, event: "Business Expo", booth: "F28", date: "15 окт 2025", user: "ДК", duration: "1 день", status: "completed" },
    { id: 5, event: "Tech Conference", booth: "G57", date: "10 окт 2025", user: "ИП", duration: "5 дней", status: "completed" },
  ];

  const filteredHistory = history.filter((item) => {
    if (historyFilter === "all") return true;
    return item.status === historyFilter;
  });

  const statusLabels = {
    "in-use": "Используется",
    available: "Свободен",
    maintenance: "На обслуживании",
  };

  const statusColors = {
    "in-use": "default",
    available: "secondary",
    maintenance: "outline",
  } as const;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2>Детали оборудования</h2>
        </div>
      </div>

      {/* Основная информация */}
      <Card className="border-border/40 bg-card/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">{equipment.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{equipment.model}</p>
              </div>
            </div>
            <Badge variant={statusColors[equipment.status as keyof typeof statusColors]} className="shadow-sm">
              {statusLabels[equipment.status as keyof typeof statusLabels]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Технические характеристики */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <span>Характеристики</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-sm">{equipment.specs}</p>
            </div>
          </div>

          <Separator />

          {/* Сетевые данные */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="mb-1 text-xs text-muted-foreground">Серийный номер</p>
              <p className="text-sm font-medium">{equipment.serial}</p>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="mb-1 text-xs text-muted-foreground">MAC адрес</p>
              <p className="text-sm font-medium font-mono">{equipment.mac}</p>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="mb-1 text-xs text-muted-foreground">IP адрес</p>
              <p className="text-sm font-medium font-mono">{equipment.ip}</p>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="mb-1 text-xs text-muted-foreground">ID устройства</p>
              <p className="text-sm font-medium">#{equipment.id}</p>
            </div>
          </div>

          <Separator />

          {/* Текущее размещение */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Текущее размещение</span>
            </div>
            <div className="rounded-lg bg-primary/10 p-3">
              <p className="text-sm font-medium">{equipment.currentLocation}</p>
              {equipment.currentEvent && (
                <p className="mt-1 text-xs text-muted-foreground">{equipment.currentEvent}</p>
              )}
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/40 bg-card/50 p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                <TrendingUp className="h-3 w-3" />
                <span>Всего использований</span>
              </div>
              <p className="text-2xl font-semibold text-primary">{equipment.totalUsage}</p>
            </div>
            <div className="rounded-lg border border-border/40 bg-card/50 p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Активных дней</p>
              <p className="text-2xl font-semibold text-primary">{Math.floor(equipment.totalUsage / 2.5)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* История перемещений */}
      <Card className="border-border/40 bg-card/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">История перемещений</CardTitle>
            <Select value={historyFilter} onValueChange={setHistoryFilter}>
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все ({history.length})</SelectItem>
                <SelectItem value="active">Активные</SelectItem>
                <SelectItem value="completed">Завершенные</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[400px] overflow-y-auto">
            {filteredHistory.map((item, index) => (
              <div key={item.id}>
                <div className="space-y-2 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2.5 flex-1">
                      <div className="rounded bg-primary/10 p-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{item.event}</p>
                          {item.status === "active" && (
                            <Badge variant="default" className="h-5 text-xs">Активно</Badge>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>Стойка {item.booth}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{item.user}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{item.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs whitespace-nowrap">
                      {item.date}
                    </Badge>
                  </div>
                </div>
                {index < filteredHistory.length - 1 && <Separator className="bg-border/40" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Действия */}
      <div className="grid gap-2">
        {equipment.status === "available" && (
          <Button className="w-full shadow-sm" size="lg">
            <MapPin className="mr-2 h-4 w-4" />
            Назначить на стойку
          </Button>
        )}
        {equipment.status === "in-use" && (
          <Button variant="outline" className="w-full" size="lg">
            Завершить использование
          </Button>
        )}
        <Button variant="outline" className="w-full">
          История обслуживания
        </Button>
      </div>
    </div>
  );
}
