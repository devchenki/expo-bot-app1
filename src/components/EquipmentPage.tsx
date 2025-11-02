import { useState } from "react";
import { Monitor, Printer, Tag, Eye } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface Equipment {
  id: number;
  name: string;
  model: string;
  type: "laptop" | "brother" | "godex";
  status: "available" | "in-use" | "maintenance";
  usageCount: number;
}

interface EquipmentPageProps {
  onViewDetails?: (type: "laptop" | "brother" | "godex", id: number) => void;
}

export function EquipmentPage({ onViewDetails }: EquipmentPageProps) {
  const [activeTab, setActiveTab] = useState("laptops");

  const equipment: Equipment[] = [
    { id: 15, name: "Ноутбук #15", model: "Dell Latitude 5420", type: "laptop", status: "in-use", usageCount: 127 },
    { id: 8, name: "Ноутбук #8", model: "HP EliteBook 840", type: "laptop", status: "available", usageCount: 98 },
    { id: 12, name: "Ноутбук #12", model: "Lenovo ThinkPad T14", type: "laptop", status: "available", usageCount: 145 },
    { id: 3, name: "Ноутбук #3", model: "Dell Latitude 5420", type: "laptop", status: "maintenance", usageCount: 203 },
    { id: 5, name: "Brother #5", model: "Brother QL-820NWB", type: "brother", status: "in-use", usageCount: 89 },
    { id: 2, name: "Brother #2", model: "Brother QL-820NWB", type: "brother", status: "available", usageCount: 156 },
    { id: 7, name: "Brother #7", model: "Brother QL-810W", type: "brother", status: "in-use", usageCount: 67 },
    { id: 31, name: "Godex #3", model: "Godex G500", type: "godex", status: "available", usageCount: 43 },
    { id: 11, name: "Godex #1", model: "Godex G500", type: "godex", status: "in-use", usageCount: 78 },
  ];

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
              <div className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2 text-sm">
                <span className="text-muted-foreground">Использований:</span>
                <span className="font-medium">{item.usageCount}</span>
              </div>
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
    </div>
  );
}
