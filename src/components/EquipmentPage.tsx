import { useState, useMemo } from "react";
import { Monitor, Printer, Tag, Eye, Package, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { ListSkeleton } from "./ui/skeletons";
import { EmptyState } from "./ui/empty-state";
import { useEquipment } from "../hooks/useEquipment";
import { useInstallations } from "../hooks/useInstallations";

interface Equipment {
  id: number;
  name: string;
  model: string;
  type: "laptop" | "brother" | "godex";
  status: "available" | "in-use" | "maintenance";
  usageCount: number;
  currentLocation?: string | null;
}

interface EquipmentPageProps {
  onViewDetails?: (type: "laptop" | "brother" | "godex", id: number) => void;
}

export function EquipmentPage({ onViewDetails }: EquipmentPageProps) {
  const [activeTab, setActiveTab] = useState("laptops");
  
  const { laptops, brotherPrinters, godexPrinters, loading } = useEquipment();
  const { installations } = useInstallations();

  // Формируем единый массив оборудования с информацией о текущих установках
  const equipment: Equipment[] = useMemo(() => {
    return [
      ...laptops.map(laptop => {
        const installation = installations.find(inst => inst.laptop === laptop.id || inst.laptop.toString() === laptop.id.toString());
        return {
          id: laptop.id,
          name: laptop.name || `Ноутбук #${laptop.id}`,
          model: laptop.specification || laptop.model || "Не указано",
          type: "laptop" as const,
          status: installation ? "in-use" as const : (
            laptop.status?.toLowerCase() === "available" ? "available" : 
            laptop.status?.toLowerCase() === "in-use" ? "in-use" : 
            "maintenance"
          ) as "available" | "in-use" | "maintenance",
          usageCount: 0,
          currentLocation: installation?.rack || null,
        };
      }),
      ...brotherPrinters.map(printer => {
        const installation = installations.find(inst => inst.printer_type === "brother" && inst.printer_number === printer.id);
        return {
          id: printer.id,
          name: printer.name || `Brother #${printer.id}`,
          model: printer.model || "Brother QL-820NWB",
          type: "brother" as const,
          status: installation ? "in-use" as const : (
            printer.status?.toLowerCase() === "available" ? "available" : 
            printer.status?.toLowerCase() === "in-use" ? "in-use" : 
            "maintenance"
          ) as "available" | "in-use" | "maintenance",
          usageCount: 0,
          currentLocation: installation?.rack || null,
        };
      }),
      ...godexPrinters.map(printer => {
        const installation = installations.find(inst => inst.printer_type === "godex" && inst.printer_number === printer.id);
        return {
          id: printer.id,
          name: printer.name || `Godex #${printer.id}`,
          model: printer.model || "Godex G500",
          type: "godex" as const,
          status: installation ? "in-use" as const : (
            printer.status?.toLowerCase() === "available" ? "available" : 
            printer.status?.toLowerCase() === "in-use" ? "in-use" : 
            "maintenance"
          ) as "available" | "in-use" | "maintenance",
          usageCount: 0,
          currentLocation: installation?.rack || null,
        };
      }),
    ];
  }, [laptops, brotherPrinters, godexPrinters, installations]);

  const filteredEquipment = equipment.filter((item) => {
    if (activeTab === "laptops") return item.type === "laptop";
    if (activeTab === "brother") return item.type === "brother";
    if (activeTab === "godex") return item.type === "godex";
    return true;
  });

  const statusColors = {
    available: "default",
    "in-use": "secondary",
    maintenance: "destructive",
  } as const;

  const statusLabels = {
    available: "Свободен",
    "in-use": "Используется",
    maintenance: "На обслуживании",
  };

  const getIcon = (type: string) => {
    if (type === "laptop") return <Monitor className="h-5 w-5" />;
    if (type === "brother") return <Printer className="h-5 w-5" />;
    return <Tag className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2>Оборудование</h2>
        <ListSkeleton count={5} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2>Оборудование</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="laptops" className="flex-1">
            <Monitor className="mr-1.5 h-4 w-4" />
            Ноутбуки
          </TabsTrigger>
          <TabsTrigger value="brother" className="flex-1">
            <Printer className="mr-1.5 h-4 w-4" />
            Brother
          </TabsTrigger>
          <TabsTrigger value="godex" className="flex-1">
            <Tag className="mr-1.5 h-4 w-4" />
            Godex
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredEquipment.length === 0 ? (
        <EmptyState
          icon={<Package className="h-12 w-12" />}
          title={`Нет ${
            activeTab === 'laptops' ? 'ноутбуков' : 
            activeTab === 'brother' ? 'принтеров Brother' : 
            'принтеров Godex'
          }`}
          description="Добавьте оборудование в систему"
        />
      ) : (
        <div className="space-y-3">
          {filteredEquipment.map((item) => (
            <Card key={item.id} className="border-border/40 bg-card/50">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getIcon(item.type)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{item.name}</CardTitle>
                      <Badge variant={statusColors[item.status]} className="shadow-sm">
                        {statusLabels[item.status]}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pb-3">
                <p className="text-sm text-muted-foreground">{item.model}</p>
                {item.currentLocation && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Стойка {item.currentLocation}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full hover:bg-primary/10 hover:text-primary"
                  onClick={() => onViewDetails?.(item.type, item.id)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Детали
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
