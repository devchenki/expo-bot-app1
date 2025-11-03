import React, { useState } from "react";
import { Plus, ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { useInstallations } from "../hooks/useInstallations";
import { useTelegramAuth } from "../hooks/useTelegramAuth";
import { useEvents } from "../hooks/useEvents";
import { activityApi } from "../lib/api";

interface CreateInstallationDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ZONES = ["C", "D", "E", "F", "G", "H"] as const;
const ZONE_RANGES = {
  C: { start: 3, end: 7 },
  D: { start: 1, end: 10 },
  E: { start: 12, end: 21 },
  F: { start: 28, end: 51 },
  G: { start: 57, end: 80 },
  H: { start: 86, end: 109 },
} as const;

const LAPTOPS = Array.from({ length: 25 }, (_, i) => i + 1); // 1-25
const BROTHER_PRINTERS = Array.from({ length: 28 }, (_, i) => i + 1); // 1-28
const GODEX_PRINTERS = Array.from({ length: 21 }, (_, i) => i + 1); // 1-21

type Step = "event" | "zone" | "booth" | "laptop" | "printer-type" | "printer-number" | "second-printer-type" | "second-printer-number";
type PrinterType = "none" | "brother" | "godex";

export function CreateInstallationDialog({ open, onClose, onSuccess }: CreateInstallationDialogProps) {
  const [step, setStep] = useState<Step>("event");
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedBooth, setSelectedBooth] = useState<string>("");
  const [selectedLaptop, setSelectedLaptop] = useState<number | null>(null);
  const [printerType, setPrinterType] = useState<PrinterType>("none");
  const [selectedPrinter, setSelectedPrinter] = useState<number | null>(null);
  const [secondPrinterType, setSecondPrinterType] = useState<PrinterType>("none");
  const [selectedSecondPrinter, setSelectedSecondPrinter] = useState<number | null>(null);
  const [laptopPage, setLaptopPage] = useState(0);
  const [printerPage, setPrinterPage] = useState(0);
  const [secondPrinterPage, setSecondPrinterPage] = useState(0);

  const itemsPerPage = 5;
  
  const { user } = useTelegramAuth();
  const { createInstallation } = useInstallations();
  const { events } = useEvents();
  const { installations } = useInstallations();

  // Получаем активные мероприятия
  const activeEvents = events.filter(e => e.status === 'active' || e.status === 'upcoming');
  
  // Получаем список занятых стоек
  const occupiedRacks = new Set(installations.map(inst => inst.rack));

  // Извлекаем зоны из выбранного мероприятия
  const getEventZones = (eventId: number | null): string[] => {
    if (!eventId) return [];
    const event = events.find(e => e.id === eventId);
    if (!event?.location) return [];
    
    // Парсим формат: "Место (E12-E21, F28-F51)"
    const match = event.location.match(/\(([^)]+)\)/);
    if (!match) return [];
    
    const zoneRanges = match[1].split(', ').map(range => {
      // Извлекаем букву зоны из формата "E12-E21" или "F28-F51"
      const zoneMatch = range.match(/^([CDEFGH])/i);
      return zoneMatch ? zoneMatch[1].toUpperCase() : null;
    }).filter(zone => zone !== null);
    
    return [...new Set(zoneRanges)] as string[];
  };

  const resetForm = () => {
    setStep("event");
    setSelectedEvent(null);
    setSelectedZone("");
    setSelectedBooth("");
    setSelectedLaptop(null);
    setPrinterType("none");
    setSelectedPrinter(null);
    setSecondPrinterType("none");
    setSelectedSecondPrinter(null);
    setLaptopPage(0);
    setPrinterPage(0);
    setSecondPrinterPage(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedLaptop) {
      toast.error("Выберите ноутбук");
      return;
    }

    try {
      await createInstallation({
        rack: `${selectedZone}${selectedBooth}`,
        laptop: selectedLaptop.toString(),
        printer_type: printerType !== "none" ? printerType : undefined,
        printer_number: selectedPrinter || undefined,
        second_printer_type: secondPrinterType !== "none" ? secondPrinterType : undefined,
        second_printer_number: selectedSecondPrinter || undefined,
        event_id: selectedEvent || undefined,
        date: new Date().toISOString(),
        user_id: user?.id?.toString(),
        username: user?.username,
      });

      let equipmentDesc = `Ноутбук #${selectedLaptop}`;
      if (printerType !== "none" && selectedPrinter) {
        equipmentDesc += `, ${printerType === "brother" ? "Brother" : "Godex"} #${selectedPrinter}`;
      }
      if (secondPrinterType !== "none" && selectedSecondPrinter) {
        equipmentDesc += `, ${secondPrinterType === "brother" ? "Brother" : "Godex"} #${selectedSecondPrinter}`;
      }

      // Логируем активность
      try {
        await activityApi.create({
          user_id: user?.id?.toString() || "",
          username: user?.username || user?.first_name || "Unknown",
          action_type: "create_installation",
          item_type: "installation",
          item_name: `Стойка ${selectedZone}${selectedBooth}`,
        });
      } catch (activityError) {
        console.error("Error logging activity:", activityError);
      }

      toast.success(`Установка ${selectedZone}${selectedBooth} создана`, {
        description: equipmentDesc,
      });
      
      // Обновляем активность после создания установки
      window.dispatchEvent(new Event('activityNeedsUpdate'));
      
      // Обновляем список установок
      if (onSuccess) {
        onSuccess();
      }
      
      handleClose();
    } catch (error) {
      console.error("Error creating installation:", error);
    }
  };

  const getBoothNumbers = () => {
    if (!selectedZone) return [];
    const range = ZONE_RANGES[selectedZone as keyof typeof ZONE_RANGES];
    return Array.from({ length: range.end - range.start + 1 }, (_, i) => range.start + i);
  };

  const getPaginatedItems = (items: number[], page: number) => {
    const start = page * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  const getTotalPages = (items: number[]) => Math.ceil(items.length / itemsPerPage);

  const renderStepContent = () => {
    switch (step) {
      case "event":
        return (
          <div className="space-y-3">
            <Label>Выберите мероприятие (необязательно)</Label>
            <div className="grid gap-2 max-h-[300px] overflow-y-auto">
              <Button
                variant={selectedEvent === null ? "default" : "outline"}
                className="h-auto justify-start p-3"
                onClick={() => {
                  setSelectedEvent(null);
                  setStep("zone");
                }}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Без мероприятия</div>
                    <div className="text-xs text-muted-foreground">Быстрая установка</div>
                  </div>
                </div>
              </Button>
              {activeEvents.map((event) => (
                <Button
                  key={event.id}
                  variant={selectedEvent === event.id ? "default" : "outline"}
                  className="h-auto justify-start p-3"
                  onClick={() => {
                    setSelectedEvent(event.id || null);
                    setStep("zone");
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{event.name}</div>
                      <div className="text-xs text-muted-foreground">{event.location}</div>
                    </div>
                    {event.status === 'upcoming' && (
                      <Badge variant="outline">Скоро</Badge>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );

      case "zone":
        const availableZones = selectedEvent ? getEventZones(selectedEvent) : ZONES;
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setStep("event")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Label>Выберите зону</Label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {availableZones.map((zone) => (
                <Button
                  key={zone}
                  variant={selectedZone === zone ? "default" : "outline"}
                  className="h-16"
                  onClick={() => {
                    setSelectedZone(zone);
                    setSelectedBooth("");
                    setStep("booth");
                  }}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold">Зона {zone}</div>
                    <div className="text-xs opacity-80">
                      {ZONE_RANGES[zone as keyof typeof ZONE_RANGES].start}-{ZONE_RANGES[zone as keyof typeof ZONE_RANGES].end}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );

      case "booth":
        const boothNumbers = getBoothNumbers();
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setStep("zone")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Label>Выберите номер стойки (Зона {selectedZone})</Label>
            </div>
            <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
              {boothNumbers.map((num) => {
                const rack = `${selectedZone}${num}`;
                const isOccupied = occupiedRacks.has(rack);
                return (
                  <Button
                    key={num}
                    variant={selectedBooth === String(num) ? "default" : "outline"}
                    disabled={isOccupied}
                    onClick={() => {
                      if (!isOccupied) {
                        setSelectedBooth(String(num));
                        setStep("laptop");
                      }
                    }}
                    className={isOccupied ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {rack}
                  </Button>
                );
              })}
            </div>
          </div>
        );

      case "laptop":
        const laptopItems = getPaginatedItems(LAPTOPS, laptopPage);
        const laptopTotalPages = getTotalPages(LAPTOPS);
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setStep("booth")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Label>Выберите ноутбук</Label>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-5 gap-2">
                {laptopItems.map((num) => (
                  <Button
                    key={num}
                    variant={selectedLaptop === num ? "default" : "outline"}
                    onClick={() => {
                      setSelectedLaptop(num);
                      setStep("printer-type");
                    }}
                  >
                    #{num}
                  </Button>
                ))}
              </div>
              {laptopTotalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLaptopPage((p) => Math.max(0, p - 1))}
                    disabled={laptopPage === 0}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {laptopPage + 1} / {laptopTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLaptopPage((p) => Math.min(laptopTotalPages - 1, p + 1))}
                    disabled={laptopPage === laptopTotalPages - 1}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case "printer-type":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setStep("laptop")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Label>Выберите тип принтера</Label>
            </div>
            <div className="grid gap-2">
              <Button
                variant={printerType === "none" ? "default" : "outline"}
                className="h-16"
                onClick={() => {
                  setPrinterType("none");
                  setSelectedPrinter(null);
                  handleSubmit();
                }}
              >
                Без принтера
              </Button>
              <Button
                variant={printerType === "brother" ? "default" : "outline"}
                className="h-16"
                onClick={() => {
                  setPrinterType("brother");
                  setPrinterPage(0);
                  setStep("printer-number");
                }}
              >
                <div className="text-center">
                  <div className="font-semibold">Brother</div>
                  <div className="text-xs opacity-80">1-28</div>
                </div>
              </Button>
              <Button
                variant={printerType === "godex" ? "default" : "outline"}
                className="h-16"
                onClick={() => {
                  setPrinterType("godex");
                  setPrinterPage(0);
                  setStep("printer-number");
                }}
              >
                <div className="text-center">
                  <div className="font-semibold">Godex</div>
                  <div className="text-xs opacity-80">1-21</div>
                </div>
              </Button>
            </div>
          </div>
        );

      case "printer-number":
        const printers = printerType === "brother" ? BROTHER_PRINTERS : GODEX_PRINTERS;
        const printerItems = getPaginatedItems(printers, printerPage);
        const printerTotalPages = getTotalPages(printers);
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setStep("printer-type")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Label>
                Выберите {printerType === "brother" ? "Brother" : "Godex"} принтер
              </Label>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-5 gap-2">
                {printerItems.map((num) => (
                  <Button
                    key={num}
                    variant={selectedPrinter === num ? "default" : "outline"}
                    onClick={() => {
                      setSelectedPrinter(num);
                      setStep("second-printer-type");
                    }}
                  >
                    #{num}
                  </Button>
                ))}
              </div>
              {printerTotalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPrinterPage((p) => Math.max(0, p - 1))}
                    disabled={printerPage === 0}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {printerPage + 1} / {printerTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPrinterPage((p) => Math.min(printerTotalPages - 1, p + 1))}
                    disabled={printerPage === printerTotalPages - 1}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case "second-printer-type":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setStep("printer-number")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Label>Добавить второй принтер?</Label>
            </div>
            <div className="grid gap-2">
              <Button
                variant="outline"
                className="h-16"
                onClick={handleSubmit}
              >
                Пропустить
              </Button>
              <Button
                variant={secondPrinterType === "brother" ? "default" : "outline"}
                className="h-16"
                onClick={() => {
                  setSecondPrinterType("brother");
                  setSecondPrinterPage(0);
                  setStep("second-printer-number");
                }}
              >
                <div className="text-center">
                  <div className="font-semibold">Brother</div>
                  <div className="text-xs opacity-80">1-28</div>
                </div>
              </Button>
              <Button
                variant={secondPrinterType === "godex" ? "default" : "outline"}
                className="h-16"
                onClick={() => {
                  setSecondPrinterType("godex");
                  setSecondPrinterPage(0);
                  setStep("second-printer-number");
                }}
              >
                <div className="text-center">
                  <div className="font-semibold">Godex</div>
                  <div className="text-xs opacity-80">1-21</div>
                </div>
              </Button>
            </div>
          </div>
        );

      case "second-printer-number":
        const secondPrinters = secondPrinterType === "brother" ? BROTHER_PRINTERS : GODEX_PRINTERS;
        const secondPrinterItems = getPaginatedItems(secondPrinters, secondPrinterPage);
        const secondPrinterTotalPages = getTotalPages(secondPrinters);
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setStep("second-printer-type")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Label>
                Выберите второй {secondPrinterType === "brother" ? "Brother" : "Godex"} принтер
              </Label>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-5 gap-2">
                {secondPrinterItems.map((num) => (
                  <Button
                    key={num}
                    variant={selectedSecondPrinter === num ? "default" : "outline"}
                    onClick={() => {
                      setSelectedSecondPrinter(num);
                    }}
                  >
                    #{num}
                  </Button>
                ))}
              </div>
              {secondPrinterTotalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSecondPrinterPage((p) => Math.max(0, p - 1))}
                    disabled={secondPrinterPage === 0}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {secondPrinterPage + 1} / {secondPrinterTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSecondPrinterPage((p) => Math.min(secondPrinterTotalPages - 1, p + 1))}
                    disabled={secondPrinterPage === secondPrinterTotalPages - 1}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canSubmit = 
    (step === "printer-number" && selectedPrinter !== null) ||
    (step === "second-printer-number" && selectedSecondPrinter !== null);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Создать установку
          </DialogTitle>
          <DialogDescription>
            Выберите зону, стойку, ноутбук и принтер для новой установки
          </DialogDescription>
        </DialogHeader>

        {renderStepContent()}

        {canSubmit && (
          <DialogFooter>
            <Button onClick={handleSubmit} className="w-full">
              Создать установку
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
