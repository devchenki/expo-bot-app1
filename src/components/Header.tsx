import React, { useState } from "react";
import { Boxes, Search, Bell, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";

interface HeaderProps {
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
  onHistoryClick?: () => void;
  onHelpClick?: () => void;
  onSettingsClick?: () => void;
  unreadNotificationsCount?: number;
}

export function Header({ 
  onSearchClick, 
  onNotificationsClick,
  onHistoryClick,
  onHelpClick,
  onSettingsClick,
  unreadNotificationsCount = 0,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { label: "История", icon: "📜", onClick: () => { onHistoryClick?.(); setMenuOpen(false); } },
    { label: "Справка", icon: "❓", onClick: () => { onHelpClick?.(); setMenuOpen(false); } },
    { label: "Настройки", icon: "⚙️", onClick: () => { onSettingsClick?.(); setMenuOpen(false); } },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-14 items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 flex-shrink-0">
            <Boxes className="h-4 w-4 text-primary" />
          </div>
          <h1 className="font-semibold truncate">ExpoBot</h1>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 p-0"
            onClick={onSearchClick}
            title="Поиск"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 p-0 relative"
            onClick={onNotificationsClick}
            title="Уведомления"
          >
            <Bell className="h-5 w-5" />
            {unreadNotificationsCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </Badge>
            )}
          </Button>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 w-9 p-0"
                title="Меню"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-56 p-0">
              <div className="space-y-1 pt-4">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
