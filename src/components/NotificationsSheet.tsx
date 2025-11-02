import { Bell, AlertTriangle, Package, CheckCircle, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
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
  const notifications: Notification[] = [
    {
      id: 1,
      type: "warning",
      title: "Низкий остаток",
      message: "Brother Ribbon Black - осталось 18 шт (минимум 20)",
      time: "5 мин назад",
      read: false,
    },
    {
      id: 2,
      type: "info",
      title: "Новая установка",
      message: "Создана установка Стойка C3 (Ноутбук #15)",
      time: "15 мин назад",
      read: false,
    },
    {
      id: 3,
      type: "success",
      title: "Установка завершена",
      message: "Стойка D7 успешно завершена",
      time: "1 час назад",
      read: true,
    },
    {
      id: 4,
      type: "warning",
      title: "Оборудование требует обслуживания",
      message: "Ноутбук #3 - 203 использования, рекомендуется проверка",
      time: "2 часа назад",
      read: true,
    },
    {
      id: 5,
      type: "info",
      title: "Пополнение расходников",
      message: "Godex Ribbon Wax - добавлено 10 шт",
      time: "3 часа назад",
      read: true,
    },
  ];

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
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Уведомления
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 min-w-5 rounded-full px-1.5 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

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

        <div className="mt-4">
          <Button variant="outline" className="w-full" size="sm">
            Отметить все как прочитанные
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
