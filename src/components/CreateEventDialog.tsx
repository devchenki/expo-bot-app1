import { useState } from "react";
import { Plus, Calendar, MapPin, Monitor, Printer, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";

interface CreateEventDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateEventDialog({ open, onClose }: CreateEventDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    laptops: 0,
    brotherPrinters: 0,
    godexPrinters: 0,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      laptops: 0,
      brotherPrinters: 0,
      godexPrinters: 0,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast.error("Заполните обязательные поля");
      return;
    }

    const totalEquipment = formData.laptops + formData.brotherPrinters + formData.godexPrinters;
    
    toast.success(`Мероприятие "${formData.name}" создано`, {
      description: `${totalEquipment} единиц оборудования запланировано`,
    });
    
    console.log("Creating event:", formData);
    handleClose();
  };

  const incrementEquipment = (type: "laptops" | "brotherPrinters" | "godexPrinters") => {
    setFormData({ ...formData, [type]: formData[type] + 1 });
  };

  const decrementEquipment = (type: "laptops" | "brotherPrinters" | "godexPrinters") => {
    setFormData({ ...formData, [type]: Math.max(0, formData[type] - 1) });
  };

  const totalEquipment = formData.laptops + formData.brotherPrinters + formData.godexPrinters;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Создать мероприятие
          </DialogTitle>
          <DialogDescription>
            Укажите информацию о мероприятии и необходимое оборудование
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Основная информация */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Основная информация</h4>
            
            <div className="space-y-2">
              <Label htmlFor="name">
                Название мероприятия <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Например: Выставка ExpoTech 2025"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Локация</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Крокус Экспо, павильон 3"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Начало <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">
                  Окончание <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  min={formData.startDate}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                placeholder="Дополнительная информация о мероприятии..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Планирование оборудования */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Необходимое оборудование</h4>
            
            <Card className="border-border/40 bg-muted/30">
              <CardContent className="p-4 space-y-3">
                {/* Ноутбуки */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded bg-primary/10 p-2">
                      <Monitor className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Ноутбуки</p>
                      <p className="text-xs text-muted-foreground">Всего доступно: 25</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => decrementEquipment("laptops")}
                      disabled={formData.laptops === 0}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-medium">{formData.laptops}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => incrementEquipment("laptops")}
                      disabled={formData.laptops >= 25}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Принтеры Brother */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded bg-primary/10 p-2">
                      <Printer className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Brother принтеры</p>
                      <p className="text-xs text-muted-foreground">Всего доступно: 28</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => decrementEquipment("brotherPrinters")}
                      disabled={formData.brotherPrinters === 0}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-medium">{formData.brotherPrinters}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => incrementEquipment("brotherPrinters")}
                      disabled={formData.brotherPrinters >= 28}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Принтеры Godex */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded bg-primary/10 p-2">
                      <Tag className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Godex принтеры</p>
                      <p className="text-xs text-muted-foreground">Всего доступно: 21</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => decrementEquipment("godexPrinters")}
                      disabled={formData.godexPrinters === 0}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-medium">{formData.godexPrinters}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => incrementEquipment("godexPrinters")}
                      disabled={formData.godexPrinters >= 21}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {totalEquipment > 0 && (
              <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-center">
                <p className="text-sm text-muted-foreground">Всего оборудования</p>
                <p className="text-2xl font-semibold text-primary">{totalEquipment}</p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Отмена
            </Button>
            <Button type="submit">
              Создать мероприятие
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
