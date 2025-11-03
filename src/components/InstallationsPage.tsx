import React, { useState, useMemo } from "react";
import { Plus, Monitor, Printer, Clock, Edit, Trash2, Package, Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { CreateInstallationDialog } from "./CreateInstallationDialog";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Separator } from "./ui/separator";
import { useInstallations } from "../hooks/useInstallations";
import { useTelegramAuth } from "../hooks/useTelegramAuth";
import { Installation } from "../lib/api/installations";
import { useEvents } from "../hooks/useEvents";
import { useEquipment } from "../hooks/useEquipment";
import { activityApi } from "../lib/api";

interface InstallationsPageProps {
  isCreateDialogOpen: boolean;
  onCloseCreateDialog: () => void;
  onCreateInstallation?: () => void;
}

export function InstallationsPage({ isCreateDialogOpen, onCloseCreateDialog, onCreateInstallation }: InstallationsPageProps) {
  const [filter, setFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInstallation, setSelectedInstallation] = useState<Installation | null>(null);
  const { user } = useTelegramAuth();
  
  // Получаем данные через API
  const { installations, loading: installationsLoading, completeInstallation, refetch } = useInstallations(
    filter !== "all" ? filter : undefined
  );
  const { events, loading: eventsLoading } = useEvents();
  const { laptops, brotherPrinters, godexPrinters } = useEquipment();

  const loading = installationsLoading || eventsLoading;

  // Форматирование данных для отображения
  const formatInstallation = (inst: Installation) => {
    const rack = inst.rack || "";
    const zone = rack[0] || "";
    const time = inst.date ? new Date(inst.date).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) : "";

    // Получаем имя ноутбука
    const laptopName = (() => {
      const laptop = laptops.find(l => l.id === Number(inst.laptop));
      return laptop?.name || `Ноутбук #${inst.laptop}`;
    })();

    // Получаем имена принтеров
    let printerDisplay = "";
    if (inst.printer_type && inst.printer_number) {
      const printer = inst.printer_type === "brother" 
        ? brotherPrinters.find(p => p.id === inst.printer_number)
        : godexPrinters.find(p => p.id === inst.printer_number);
      const printerName = printer?.name || `${inst.printer_type === "brother" ? "Brother" : "Godex"} #${inst.printer_number}`;
      printerDisplay = printerName;
    }
    
    if (inst.second_printer_type && inst.second_printer_number) {
      const secondPrinter = inst.second_printer_type === "brother" 
        ? brotherPrinters.find(p => p.id === inst.second_printer_number)
        : godexPrinters.find(p => p.id === inst.second_printer_number);
      const secondPrinterName = secondPrinter?.name || `${inst.second_printer_type === "brother" ? "Brother" : "Godex"} #${inst.second_printer_number}`;
      printerDisplay += `, ${secondPrinterName}`;
    }

    return {
      ...inst,
      booth: rack,
      zone,
      laptop: laptopName,
      printer: printerDisplay || "Без принтера",
      time,
      status: "active" as const,
    };
  };

  const formattedInstallations = installations.map(formatInstallation);

  // Группируем установки по мероприятиям и зонам
  const installationsByEventAndZone = useMemo(() => {
    type FormattedInstallation = typeof formattedInstallations[0];
    const grouped: Record<string, Record<string, FormattedInstallation[]>> = {};
    
    formattedInstallations.forEach(inst => {
      // Определяем мероприятие для установки
      let eventName = "Без мероприятия";
      
      if (inst.event_id) {
        const event = events.find(e => e.id === inst.event_id);
        if (event) {
          eventName = event.name;
        }
      }
      
      // Создаем ключ группировки
      if (!grouped[eventName]) {
        grouped[eventName] = {};
      }
      
      if (!grouped[eventName][inst.zone]) {
        grouped[eventName][inst.zone] = [];
      }
      
      grouped[eventName][inst.zone].push(inst);
    });

    // Сортируем зоны внутри каждого мероприятия
    Object.keys(grouped).forEach(eventName => {
      Object.keys(grouped[eventName]).forEach(zone => {
        grouped[eventName][zone].sort((a, b) => {
          const numA = parseInt(a.booth.substring(1)) || 0;
          const numB = parseInt(b.booth.substring(1)) || 0;
          return numA - numB;
        });
      });
    });

    return grouped;
  }, [formattedInstallations, events, laptops, brotherPrinters, godexPrinters]);

  const handleDelete = async () => {
    if (selectedInstallation?.id) {
      try {
        await completeInstallation(selectedInstallation.id);
        
        // Логируем активность
        try {
          await activityApi.create({
            user_id: user?.id?.toString() || "",
            username: user?.username || user?.first_name || "Unknown",
            action_type: "complete_installation",
            item_type: "installation",
            item_name: `Стойка ${selectedInstallation.rack}`,
          });
        } catch (activityError) {
          console.error("Error logging activity:", activityError);
        }
        
        toast.success(`Установка завершена`);
        setDeleteDialogOpen(false);
        setSelectedInstallation(null);
      } catch (error) {
        console.error("Error completing installation:", error);
      }
    }
  };

  const statusColors = {
    active: "default",
    completed: "secondary",
    pending: "outline",
  } as const;

  const statusLabels = {
    active: "Активна",
    completed: "Завершена",
    pending: "Ожидает",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2>Установки</h2>
        <Button size="sm" onClick={onCreateInstallation}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="C">C</TabsTrigger>
          <TabsTrigger value="D">D</TabsTrigger>
          <TabsTrigger value="E">E</TabsTrigger>
          <TabsTrigger value="F">F</TabsTrigger>
          <TabsTrigger value="G">G</TabsTrigger>
          <TabsTrigger value="H">H</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="border-border/40 bg-card/50">
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : Object.keys(installationsByEventAndZone).length === 0 ? (
        <Card className="border-border/40 bg-card/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="mb-3 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Нет активных установок</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(installationsByEventAndZone).map(([eventName, zones]) => {
            type ZoneData = Record<string, ReturnType<typeof formatInstallation>[]>;
            const typedZones = zones as ZoneData;
            
            return (
              <div key={eventName} className="space-y-3">
                {/* Заголовок мероприятия */}
                <div className="flex items-center gap-2 px-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-base">{eventName}</h3>
                  <Badge variant="outline" className="ml-auto">
                    {Object.values(typedZones).reduce((sum, zoneInsts) => sum + zoneInsts.length, 0)} установок
                  </Badge>
                </div>

                {/* Установки по зонам */}
                {Object.entries(typedZones).map(([zone, zoneInstallations]) => (
                  <div key={`${eventName}-${zone}`} className="space-y-2">
                  {/* Заголовок зоны */}
                  <div className="flex items-center gap-2 px-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Зона {zone}</span>
                  </div>

                  {/* Карточки установок в зоне */}
                  {zoneInstallations.map((installation) => (
                    <Card key={installation.id} className="border-border/40 bg-card/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">Стойка {installation.booth}</CardTitle>
                          <Badge variant={statusColors[installation.status]} className="shadow-sm">
                            {statusLabels[installation.status]}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 pb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="rounded bg-primary/10 p-1">
                            <Monitor className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <span>{installation.laptop}</span>
                        </div>
                        {installation.printer && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="rounded bg-primary/10 p-1">
                              <Printer className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span>{installation.printer}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="rounded bg-muted/50 p-1">
                            <Clock className="h-3.5 w-3.5" />
                          </div>
                          <span>{installation.time}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="gap-2 pt-3">
                        <Button variant="ghost" size="sm" className="flex-1 hover:bg-primary/10 hover:text-primary">
                          <Edit className="mr-2 h-4 w-4" />
                          Изменить
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex-1 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => {
                            setSelectedInstallation(installation);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Завершить
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ))}
                <Separator className="my-4" />
              </div>
            );
          })}
        </div>
      )}

      <CreateInstallationDialog
        open={isCreateDialogOpen}
        onClose={onCloseCreateDialog}
        onSuccess={refetch}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Завершить установку?</AlertDialogTitle>
            <AlertDialogDescription>
              Установка {selectedInstallation?.rack} будет помечена как завершенная.
              Оборудование вернется в пул доступного.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Завершить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
