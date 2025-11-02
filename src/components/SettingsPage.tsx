import { User, Moon, Bell, Shield, Info, Database, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Настройки</h2>
        <p className="text-sm text-muted-foreground">Управление профилем и приложением</p>
      </div>

      {/* Профиль */}
      <Card className="border-border/40 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Профиль</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-lg text-primary">
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">Иван Петров</p>
              <p className="text-sm text-muted-foreground">ivan.petrov@expo.ru</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          <Button variant="outline" className="w-full">
            Редактировать профиль
          </Button>
        </CardContent>
      </Card>

      {/* Внешний вид */}
      <Card className="border-border/40 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Внешний вид</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <Moon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Темная тема</p>
                <p className="text-xs text-muted-foreground">Включена по умолчанию</p>
              </div>
            </div>
            <Switch checked disabled />
          </div>
        </CardContent>
      </Card>

      {/* Уведомления */}
      <Card className="border-border/40 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Уведомления</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Push-уведомления</p>
                <p className="text-xs text-muted-foreground">О новых установках</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator className="bg-border/40" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Низкий остаток</p>
                <p className="text-xs text-muted-foreground">Расходные материалы</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Безопасность */}
      <Card className="border-border/40 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Безопасность</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <button className="flex w-full items-center justify-between transition-colors hover:text-primary">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Изменить пароль</p>
                <p className="text-xs text-muted-foreground">Последнее изменение 30 дней назад</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>

      {/* Данные */}
      <Card className="border-border/40 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Управление данными</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <button className="flex w-full items-center justify-between transition-colors hover:text-primary">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <Database className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Экспорт данных</p>
                <p className="text-xs text-muted-foreground">Скачать все данные в PDF</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>

      {/* О проекте */}
      <Card className="border-border/40 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">О приложении</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <button className="flex w-full items-center justify-between transition-colors hover:text-primary">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <Info className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">ExpoBot</p>
                <p className="text-xs text-muted-foreground">Версия 1.0.0</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>

      <Button variant="destructive" className="w-full">
        Выйти из аккаунта
      </Button>
    </div>
  );
}
