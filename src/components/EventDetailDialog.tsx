import { Calendar, MapPin, Monitor, Printer, Tag, Package, FileText, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { toast } from "sonner@2.0.3";

interface Event {
  id: number;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "active" | "completed";
  booths: number;
  laptops: number;
  brotherPrinters: number;
  godexPrinters: number;
}

interface EventDetailDialogProps {
  open: boolean;
  onClose: () => void;
  event: Event | null;
}

export function EventDetailDialog({ open, onClose, event }: EventDetailDialogProps) {
  if (!event) return null;

  const installations = [
    { booth: "C3", laptop: "#15", printer: "Brother #5" },
    { booth: "C7", laptop: "#8", printer: "Brother #2" },
    { booth: "D2", laptop: "#12", printer: "Godex #3" },
    { booth: "E12", laptop: "#3", printer: "Brother #7" },
    { booth: "F28", laptop: "#19", printer: "Godex #1" },
  ];

  const consumables = [
    { name: "Brother Ribbon", used: 45, planned: 50 },
    { name: "Brother Labels 40mm", used: 230, planned: 250 },
    { name: "Godex Ribbon", used: 18, planned: 20 },
    { name: "Godex Labels 58mm", used: 150, planned: 180 },
  ];

  const handleGeneratePDF = () => {
    toast.success("PDF отчет", {
      description: `Отчет по мероприятию "${event.name}" будет загружен`,
    });
  };

  const totalEquipment = event.laptops + event.brotherPrinters + event.godexPrinters;
  const usedEquipment = installations.length;
  const equipmentProgress = (usedEquipment / totalEquipment) * 100;

  const statusColors = {
    upcoming: "outline",
    active: "default",
    completed: "secondary",
  } as const;

  const statusLabels = {
    upcoming: "Запланировано",
    active: "Активно",
    completed: "Завершено",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <DialogTitle>{event.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                {event.location}
              </DialogDescription>
            </div>
            <Badge variant={statusColors[event.status]}>
              {statusLabels[event.status]}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Даты мероприятия */}
          <Card className="border-border/40 bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded bg-primary/10 p-2">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Период проведения</p>
                  <p className="font-medium">
                    {event.startDate} — {event.endDate}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Оборудование */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Оборудование</h4>
              <Badge variant="outline">
                {usedEquipment} / {totalEquipment} использовано
              </Badge>
            </div>
            
            <Progress value={equipmentProgress} className="h-2" />

            <div className="grid gap-2">
              <div className="flex items-center justify-between rounded-lg border border-border/40 bg-card/50 p-3">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-primary" />
                  <span className="text-sm">Ноутбуки</span>
                </div>
                <span className="text-sm font-medium">{event.laptops} шт</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/40 bg-card/50 p-3">
                <div className="flex items-center gap-2">
                  <Printer className="h-4 w-4 text-primary" />
                  <span className="text-sm">Brother принтеры</span>
                </div>
                <span className="text-sm font-medium">{event.brotherPrinters} шт</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/40 bg-card/50 p-3">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="text-sm">Godex принтеры</span>
                </div>
                <span className="text-sm font-medium">{event.godexPrinters} шт</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Установки */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Активные установки ({installations.length})</h4>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {installations.map((inst, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border/40 bg-card/50 p-3 text-sm"
                >
                  <span className="font-medium">Стойка {inst.booth}</span>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span>{inst.laptop}</span>
                    <span>•</span>
                    <span>{inst.printer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Расход материалов */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-medium">Расход материалов</h4>
            </div>
            
            <div className="space-y-2">
              {consumables.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="text-muted-foreground">
                      {item.used} / {item.planned} шт
                    </span>
                  </div>
                  <Progress value={(item.used / item.planned) * 100} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Действия */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleGeneratePDF}
            >
              <Download className="mr-2 h-4 w-4" />
              PDF отчет
            </Button>
            <Button variant="outline" className="flex-1">
              <FileText className="mr-2 h-4 w-4" />
              Экспорт данных
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
