import { TrendingUp, TrendingDown, Package, MapPin, FileText, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function StatisticsPage() {
  const topEquipment = [
    { id: 1, name: "Ноутбук #3", usage: 203 },
    { id: 2, name: "Brother #2", usage: 156 },
    { id: 3, name: "Ноутбук #12", usage: 145 },
    { id: 4, name: "Ноутбук #15", usage: 127 },
    { id: 5, name: "Ноутбук #8", usage: 98 },
  ];

  const heatmapData = [
    { zone: "A", usage: 45, color: "bg-green-500" },
    { zone: "B", usage: 38, color: "bg-green-400" },
    { zone: "C", usage: 67, color: "bg-yellow-500" },
    { zone: "D", usage: 82, color: "bg-orange-500" },
    { zone: "E", usage: 56, color: "bg-yellow-400" },
    { zone: "F", usage: 91, color: "bg-red-500" },
    { zone: "G", usage: 42, color: "bg-green-400" },
    { zone: "H", usage: 73, color: "bg-orange-400" },
  ];

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
            <div className="text-3xl font-medium">450</div>
            <Badge variant="default" className="gap-1 shadow-sm">
              <TrendingUp className="h-3 w-3" />
              +15%
            </Badge>
            <p className="text-xs text-muted-foreground">За месяц</p>
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
            <div className="text-3xl font-medium">125</div>
            <Badge variant="secondary" className="gap-1 shadow-sm">
              <TrendingDown className="h-3 w-3" />
              -3%
            </Badge>
            <p className="text-xs text-muted-foreground">За месяц</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="mb-3 text-sm">Тепловая карта использования по зонам</h3>
        <Card className="border-border/40 bg-card/50">
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-3">
              {heatmapData.map((zone) => (
                <div key={zone.zone} className="space-y-2">
                  <div
                    className={`aspect-square rounded-lg ${zone.color} flex items-center justify-center shadow-sm`}
                  >
                    <div className="text-center text-white">
                      <div className="font-semibold">{zone.zone}</div>
                      <div className="text-xs">{zone.usage}</div>
                    </div>
                  </div>
                </div>
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

      <div>
        <h3 className="mb-3 text-sm">Топ-5 оборудования</h3>
        <Card className="border-border/40 bg-card/50">
          <CardContent className="p-0">
            {topEquipment.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b border-border/40 p-4 last:border-0"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  {index === 0 ? (
                    <Award className="h-4 w-4 text-primary" />
                  ) : (
                    <span className="text-sm font-medium text-primary">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{item.usage}</p>
                  <p className="text-xs text-muted-foreground">использований</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Button className="w-full shadow-sm" size="lg">
        <FileText className="mr-2 h-4 w-4" />
        Сгенерировать PDF отчет
      </Button>
    </div>
  );
}
