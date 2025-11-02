import { useState } from "react";
import { Plus, ArrowLeft, ArrowRight } from "lucide-react";
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
import { toast } from "sonner@2.0.3";

interface CreateInstallationDialogProps {
  open: boolean;
  onClose: () => void;
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

type Step = "zone" | "booth" | "laptop" | "printer-type" | "printer-number";
type PrinterType = "none" | "brother" | "godex";

export function CreateInstallationDialog({ open, onClose }: CreateInstallationDialogProps) {
  const [step, setStep] = useState<Step>("zone");
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedBooth, setSelectedBooth] = useState<string>("");
  const [selectedLaptop, setSelectedLaptop] = useState<number | null>(null);
  const [printerType, setPrinterType] = useState<PrinterType>("none");
  const [selectedPrinter, setSelectedPrinter] = useState<number | null>(null);
  const [laptopPage, setLaptopPage] = useState(0);
  const [printerPage, setPrinterPage] = useState(0);

  const itemsPerPage = 5;

  const resetForm = () => {
    setStep("zone");
    setSelectedZone("");
    setSelectedBooth("");
    setSelectedLaptop(null);
    setPrinterType("none");
    setSelectedPrinter(null);
    setLaptopPage(0);
    setPrinterPage(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    const installation = {
      booth: `${selectedZone}${selectedBooth}`,
      laptop: selectedLaptop,
      printerType,
      printer: selectedPrinter,
    };
    
    console.log("Creating installation:", installation);
    toast.success(`Установка ${installation.booth} создана`, {
      description: `Ноутбук #${installation.laptop}${
        installation.printerType !== "none"
          ? `, ${installation.printerType === "brother" ? "Brother" : "Godex"} #${installation.printer}`
          : ""
      }`,
    });
    
    handleClose();
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
      case "zone":
        return (
          <div className="space-y-3">
            <Label>Выберите зону</Label>
            <div className="grid grid-cols-3 gap-2">
              {ZONES.map((zone) => (
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
                      {ZONE_RANGES[zone].start}-{ZONE_RANGES[zone].end}
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
              {boothNumbers.map((num) => (
                <Button
                  key={num}
                  variant={selectedBooth === String(num) ? "default" : "outline"}
                  onClick={() => {
                    setSelectedBooth(String(num));
                    setStep("laptop");
                  }}
                >
                  {selectedZone}{num}
                </Button>
              ))}
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

      default:
        return null;
    }
  };

  const canSubmit = step === "printer-number" && selectedPrinter !== null;

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
