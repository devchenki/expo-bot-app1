import { useState } from "react";
import { Minus, Plus, Printer, Tag } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";

interface Consumable {
  id: number;
  name: string;
  type: "brother" | "godex";
  quantity: number;
  minimum: number;
}

export function ConsumablesPage() {
  const [activeTab, setActiveTab] = useState("brother");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Consumable | null>(null);
  const [operation, setOperation] = useState<"add" | "remove">("add");
  const [amount] = useState(5);

  const [consumables, setConsumables] = useState<Consumable[]>([
    { id: 1, name: "Brother Ribbon Black", type: "brother", quantity: 45, minimum: 20 },
    { id: 2, name: "Brother Ribbon Red", type: "brother", quantity: 18, minimum: 20 },
    { id: 3, name: "Brother Labels 62mm", type: "brother", quantity: 120, minimum: 30 },
    { id: 4, name: "Brother Labels 29mm", type: "brother", quantity: 85, minimum: 30 },
    { id: 5, name: "Godex Ribbon Wax", type: "godex", quantity: 32, minimum: 15 },
    { id: 6, name: "Godex Ribbon Resin", type: "godex", quantity: 12, minimum: 15 },
    { id: 7, name: "Godex Labels 58mm", type: "godex", quantity: 67, minimum: 25 },
  ]);

  const filteredConsumables = consumables.filter((item) => item.type === activeTab);

  const handleOperation = (item: Consumable, type: "add" | "remove") => {
    setSelectedItem(item);
    setOperation(type);
    setDialogOpen(true);
  };

  const confirmOperation = () => {
    if (!selectedItem) return;
    
    setConsumables(consumables.map(item => {
      if (item.id === selectedItem.id) {
        const newQuantity = operation === "add" 
          ? item.quantity + amount 
          : Math.max(0, item.quantity - amount);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
    
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const getProgressValue = (quantity: number, minimum: number) => {
    const maxStock = minimum * 5;
    return (quantity / maxStock) * 100;
  };

  const isLowStock = (quantity: number, minimum: number) => {
    return quantity <= minimum;
  };

  return (
    <div className="space-y-4">
      <h2>Расходные материалы</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="brother">
            <Printer className="mr-2 h-4 w-4" />
            Brother
          </TabsTrigger>
          <TabsTrigger value="godex">
            <Tag className="mr-2 h-4 w-4" />
            Godex
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {filteredConsumables.map((item) => (
          <Card key={item.id} className="border-border/40 bg-card/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{item.name}</CardTitle>
                {isLowStock(item.quantity, item.minimum) && (
                  <Badge variant="destructive" className="shadow-sm">Низкий остаток</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pb-3">
              <div className="text-center">
                <div className="text-3xl font-medium">{item.quantity}</div>
                <p className="text-xs text-muted-foreground">штук в наличии</p>
              </div>
              <Progress 
                value={getProgressValue(item.quantity, item.minimum)} 
                className="h-2"
              />
              <p className="text-xs text-center text-muted-foreground">
                Минимум: {item.minimum} шт
              </p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => handleOperation(item, "remove")}
              >
                <Minus className="mr-1 h-4 w-4" />
                {amount}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 hover:bg-primary/10 hover:text-primary"
                onClick={() => handleOperation(item, "add")}
              >
                <Plus className="mr-1 h-4 w-4" />
                {amount}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {operation === "add" ? "Добавить" : "Использовать"} расходники
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Текущее количество:</p>
                <p className="text-2xl">{selectedItem.quantity} шт</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Операция:</p>
                <p className="text-xl">
                  {operation === "add" ? "+" : "-"} {amount} шт
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Новое количество:</p>
                <p className="text-2xl">
                  {operation === "add" 
                    ? selectedItem.quantity + amount 
                    : Math.max(0, selectedItem.quantity - amount)} шт
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={confirmOperation}>
              Подтвердить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
