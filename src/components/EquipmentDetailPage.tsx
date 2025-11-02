import { ArrowLeft, Monitor, MapPin, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface EquipmentDetailPageProps {
  onBack: () => void;
}

export function EquipmentDetailPage({ onBack }: EquipmentDetailPageProps) {
  const equipment = {
    id: 15,
    name: "Ноутбук #15",
    model: "Dell Latitude 5420",
    serial: "SN12345678",
    mac: "00:1A:2B:3C:4D:5E",
    status: "in-use",
    currentLocation: "Стойка C3",
    totalUsage: 127,
  };

  const history = [
    { id: 1, event: "TechExpo Moscow 2025", booth: "C3", date: "15 марта 2025", user: "ИП" },
    { id: 2, event: "Digital Forum", booth: "D7", date: "10 марта 2025", user: "АС" },
    { id: 3, event: "Innovation Summit", booth: "E12", date: "3 марта 2025", user: "МП" },
    { id: 4, event: "Business Expo", booth: "F28", date: "25 февраля 2025", user: "ДК" },
    { id: 5, event: "Tech Conference", booth: "G57", date: "18 февраля 2025", user: "ИП" },
  ];

  const statusLabels = {
    "in-use": "Используется",
    available: "Свободен",
    maintenance: "На обслуживании",
  };

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

      <Card className="border-border/40 bg-card/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <Monitor className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">{equipment.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{equipment.model}</p>
              </div>
            </div>
            <Badge variant="secondary" className="shadow-sm">
              {statusLabels[equipment.status as keyof typeof statusLabels]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md bg-muted/30 p-3">
              <p className="mb-1 text-xs text-muted-foreground">Серийный номер</p>
              <p className="text-sm font-medium">{equipment.serial}</p>
            </div>
            <div className="rounded-md bg-muted/30 p-3">
              <p className="mb-1 text-xs text-muted-foreground">MAC адрес</p>
              <p className="text-sm font-medium">{equipment.mac}</p>
            </div>
          </div>
          <div className="rounded-md bg-muted/30 p-3">
            <p className="mb-1 text-xs text-muted-foreground">Текущее местоположение</p>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <p className="text-sm font-medium">{equipment.currentLocation}</p>
            </div>
          </div>
          <div className="rounded-md bg-muted/30 p-3">
            <p className="mb-1 text-xs text-muted-foreground">Всего использований</p>
            <p className="text-2xl font-medium">{equipment.totalUsage}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40 bg-card/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">История перемещений</CardTitle>
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все события</SelectItem>
                <SelectItem value="active">Активные</SelectItem>
                <SelectItem value="completed">Завершенные</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {history.map((item, index) => (
            <div key={item.id}>
              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <div className="rounded bg-primary/10 p-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.event}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>Стойка {item.booth}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{item.user}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.date}
                  </Badge>
                </div>
              </div>
              {index < history.length - 1 && <Separator className="bg-border/40" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Button className="w-full shadow-sm" size="lg">
        <MapPin className="mr-2 h-4 w-4" />
        Назначить на стойку
      </Button>
    </div>
  );
}
