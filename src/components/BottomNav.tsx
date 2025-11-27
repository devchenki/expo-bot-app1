import { Home, Package, Monitor, Calendar, ShoppingCart, BarChart3 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface BottomNavProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export function BottomNav({ activePage, onPageChange }: BottomNavProps) {
  const navItems = [
    { id: "home", icon: Home, label: "Главная" },
    { id: "installations", icon: Package, label: "Установки" },
    { id: "equipment", icon: Monitor, label: "Оборудование" },
    { id: "events", icon: Calendar, label: "События" },
    { id: "consumables", icon: ShoppingCart, label: "Расходники" },
    { id: "statistics", icon: BarChart3, label: "Статистика" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex max-w-[600px] items-center justify-around h-14">
        <TooltipProvider>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onPageChange(item.id)}
                    className={`flex items-center justify-center h-14 w-14 rounded-md transition-all ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                    aria-label={item.label}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="mb-2">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </nav>
  );
}
