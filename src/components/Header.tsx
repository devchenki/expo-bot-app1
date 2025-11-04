import React from "react";
import { Boxes, Search, Bell, History, HelpCircle, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

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
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-14 items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
            <Boxes className="h-4 w-4 text-primary" />
          </div>
          <h1 className="font-semibold">ExpoBot</h1>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={onSearchClick}
            title="Поиск"
          >
            <Search className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 relative"
            onClick={onNotificationsClick}
            title="Уведомления"
          >
            <Bell className="h-4 w-4" />
            {unreadNotificationsCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full px-1 text-[10px] flex items-center justify-center"
              >
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </Badge>
            )}
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={onHistoryClick}
            title="История изменений"
          >
            <History className="h-4 w-4" />
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={onHelpClick}
            title="Помощь"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={onSettingsClick}
            title="Настройки"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
