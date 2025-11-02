import { User, Boxes, Search, QrCode, Bell, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

interface HeaderProps {
  onSearchClick?: () => void;
  onQRClick?: () => void;
  onNotificationsClick?: () => void;
  onMenuItemClick?: (page: string) => void;
}

export function Header({ 
  onSearchClick, 
  onQRClick, 
  onNotificationsClick,
  onMenuItemClick 
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
          >
            <Search className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={onQRClick}
          >
            <QrCode className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative h-8 w-8 p-0"
            onClick={onNotificationsClick}
          >
            <Bell className="h-4 w-4" />
            <Badge 
              variant="destructive" 
              className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full px-1 text-[10px]"
            >
              2
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onMenuItemClick?.("history")}>
                История изменений
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMenuItemClick?.("help")}>
                Помощь
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onMenuItemClick?.("settings")}>
                Настройки
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
