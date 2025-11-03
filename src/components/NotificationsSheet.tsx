import React from "react";
import { Bell, AlertTriangle, Package, CheckCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface Notification {
  id: number;
  type: "warning" | "info" | "success";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationsSheetProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationsSheet({ open, onClose }: NotificationsSheetProps) {
  // TODO: Реализовать получение уведомлений из API
  const notifications: Notification[] = [];

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Package className="h-4 w-4 text-primary" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Уведомления
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 min-w-5 rounded-full px-1.5 text-xs">
                {unreadCount}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Список всех уведомлений системы
          </SheetDescription>
        </SheetHeader>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Bell className="mb-3 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Нет уведомлений</p>
          </div>
        ) : (
          <div className="mt-6 space-y-2">
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                <div
                  className={`rounded-lg border p-3 transition-colors ${
                    notification.read
                      ? "border-border/40 bg-card/30"
                      : "border-primary/30 bg-card/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 rounded-md p-2 ${
                      notification.type === "warning"
                        ? "bg-destructive/10"
                        : notification.type === "success"
                        ? "bg-green-500/10"
                        : "bg-primary/10"
                    }`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium">{notification.title}</p>
                        {!notification.read && (
                          <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                </div>
                {index < notifications.length - 1 && <Separator className="my-2 bg-border/40" />}
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
