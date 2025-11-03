import React, { useState } from "react";
import { TrendingUp, TrendingDown, Package, MapPin, FileText, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useInstallations } from "../hooks/useInstallations";
import { useStatistics } from "../hooks/useStatistics";
import { useEquipment } from "../hooks/useEquipment";

export function StatisticsPage() {
  const { installations } = useInstallations();
  const { laptops } = useEquipment();
  const { heatmapData, loading } = useStatistics();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  
  // Вычисляем статистику
  const totalInstallations = installations.length;
  const uniqueRacks = new Set(installations.map(inst => inst.rack)).size;
  
  // Топ-5 оборудования будет выводиться на основе фактической статистики из БД

  // Тепловая карта зон
  const getZoneColor = (usage: number, maxUsage: number) => {
    const intensity = usage / maxUsage;
    if (intensity < 0.2) return "bg-green-500";
    if (intensity < 0.4) return "bg-green-400";
    if (intensity < 0.6) return "bg-yellow-500";
    if (intensity < 0.8) return "bg-orange-500";
    return "bg-red-500";
  };

  const heatmapZones = ["E", "F", "G", "H"];  // Только павильоны Экспофорума
  const zoneUsage: Record<string, number> = {};
  heatmapZones.forEach(zone => {
    zoneUsage[zone] = installations.filter(inst => inst.rack?.startsWith(zone)).length;
  });
  
  const maxUsage = Math.max(...Object.values(zoneUsage), 1);
  const heatmapDataDisplay = heatmapZones.map(zone => ({
    zone,
    usage: zoneUsage[zone] || 0,
    color: getZoneColor(zoneUsage[zone] || 0, maxUsage),
  }));
  
  // Получаем установки для выбранной зоны
  const zoneInstallations = selectedZone 
    ? installations.filter(inst => inst.rack?.startsWith(selectedZone))
    : [];

  return (
    <div className="space-y-6">
      <h2>Статистика</h2>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-border/40 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="rounded bg-primary/10 p-1">
                <Package className="h-3.5 w-3.5 text-primary" />
              </div>
              Установки
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-medium">{totalInstallations}</div>
            <Badge variant="default" className="gap-1 shadow-sm">
              <TrendingUp className="h-3 w-3" />
              Активных
            </Badge>
            <p className="text-xs text-muted-foreground">Сейчас</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="rounded bg-primary/10 p-1">
                <MapPin className="h-3.5 w-3.5 text-primary" />
              </div>
              Стойки
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-medium">{uniqueRacks}</div>
            <Badge variant="secondary" className="gap-1 shadow-sm">
              <TrendingUp className="h-3 w-3" />
              Используется
            </Badge>
            <p className="text-xs text-muted-foreground">Из активных</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="mb-3 text-sm">Тепловая карта использования по павильонам</h3>
        <Card className="border-border/40 bg-card/50">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {heatmapDataDisplay.map((zone) => (
                <button
                  key={zone.zone}
                  onClick={() => setSelectedZone(zone.zone)}
                  className="space-y-2 transition-transform hover:scale-105"
                >
                  <div
                    className={`aspect-square rounded-lg ${zone.color} flex items-center justify-center shadow-sm cursor-pointer`}
                  >
                    <div className="text-center text-white">
                      <div className="font-semibold">{zone.zone}</div>
                      <div className="text-xs">{zone.usage}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-green-500 shadow-sm"></div>
                <span className="text-muted-foreground">Низкая</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-yellow-500 shadow-sm"></div>
                <span className="text-muted-foreground">Средняя</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-orange-500 shadow-sm"></div>
                <span className="text-muted-foreground">Высокая</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-red-500 shadow-sm"></div>
                <span className="text-muted-foreground">Очень высокая</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Модальное окно для павильона */}
      <Dialog open={!!selectedZone} onOpenChange={(open) => !open && setSelectedZone(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Павильон {selectedZone}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {zoneInstallations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Нет установок в этом павильоне
              </p>
            ) : (
              zoneInstallations.map((inst) => {
                const laptop = laptops.find(l => l.id === inst.laptop || l.id.toString() === inst.laptop?.toString());
                return (
                  <Card key={inst.id} className="border-border/40 bg-card/50">
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Стойка {inst.rack}</span>
                        <Badge variant="secondary" className="shadow-sm">
                          Активна
                        </Badge>
                      </div>
                      {laptop && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{laptop.name}: {laptop.specification}</span>
                        </div>
                      )}
                      {(inst.printer_type || inst.second_printer_type) && (
                        <div className="text-xs text-muted-foreground">
                          Принтеры: 
                          {inst.printer_type && ` ${inst.printer_type} #${inst.printer_number}`}
                          {inst.second_printer_type && `, ${inst.second_printer_type} #${inst.second_printer_number}`}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Button className="w-full shadow-sm" size="lg">
        <FileText className="mr-2 h-4 w-4" />
        Сгенерировать PDF отчет
      </Button>
    </div>
  );
}
