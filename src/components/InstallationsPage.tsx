import { useState } from "react";
import { Plus, Monitor, Printer, Clock, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { CreateInstallationDialog } from "./CreateInstallationDialog";
import { toast } from "sonner@2.0.3";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface Installation {
  id: number;
  booth: string;
  laptop: string;
  printer: string;
  time: string;
  status: "active" | "completed" | "pending";
  zone: string;
}

interface InstallationsPageProps {
  isCreateDialogOpen: boolean;
  onCloseCreateDialog: () => void;
}

export function InstallationsPage({ isCreateDialogOpen, onCloseCreateDialog }: InstallationsPageProps) {
  const [filter, setFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInstallation, setSelectedInstallation] = useState<Installation | null>(null);

  const installations: Installation[] = [
    { id: 1, booth: "C3", laptop: "Ноутбук #15", printer: "Brother #5", time: "10:30", status: "active", zone: "C" },
    { id: 2, booth: "C7", laptop: "Ноутбук #8", printer: "Brother #2", time: "09:45", status: "active", zone: "C" },
    { id: 3, booth: "D2", laptop: "Ноутбук #12", printer: "Godex #3", time: "11:15", status: "pending", zone: "D" },
    { id: 4, booth: "D9", laptop: "Ноутбук #22", printer: "Brother #8", time: "10:50", status: "active", zone: "D" },
    { id: 5, booth: "E12", laptop: "Ноутбук #3", printer: "Brother #7", time: "08:20", status: "completed", zone: "E" },
    { id: 6, booth: "E18", laptop: "Ноутбук #11", printer: "Godex #2", time: "09:10", status: "active", zone: "E" },
    { id: 7, booth: "F28", laptop: "Ноутбук #19", printer: "Godex #1", time: "10:00", status: "active", zone: "F" },
    { id: 8, booth: "F35", laptop: "Ноутбук #7", printer: "Brother #3", time: "11:30", status: "pending", zone: "F" },
    { id: 9, booth: "G57", laptop: "Ноутбук #5", printer: "Brother #4", time: "09:30", status: "active", zone: "G" },
    { id: 10, booth: "G64", laptop: "Ноутбук #14", printer: "Godex #5", time: "08:45", status: "active", zone: "G" },
    { id: 11, booth: "H86", laptop: "Ноутбук #20", printer: "Brother #1", time: "10:15", status: "active", zone: "H" },
    { id: 12, booth: "H95", laptop: "Ноутбук #9", printer: "Godex #4", time: "09:00", status: "completed", zone: "H" },
  ];

  const filteredInstallations = installations.filter((inst) => {
    if (filter === "all") return true;
    return inst.zone === filter;
  });

  const handleDelete = () => {
    if (selectedInstallation) {
      toast.success(`Установка ${selectedInstallation.booth} завершена`);
      setDeleteDialogOpen(false);
      setSelectedInstallation(null);
    }
  };

  const statusColors = {
    active: "default",
    completed: "secondary",
    pending: "outline",
  } as const;

  const statusLabels = {
    active: "Активна",
    completed: "Завершена",
    pending: "Ожидает",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2>Установки</h2>
        <Button size="sm" onClick={() => {}}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="C">C</TabsTrigger>
          <TabsTrigger value="D">D</TabsTrigger>
          <TabsTrigger value="E">E</TabsTrigger>
          <TabsTrigger value="F">F</TabsTrigger>
          <TabsTrigger value="G">G</TabsTrigger>
          <TabsTrigger value="H">H</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {filteredInstallations.map((installation) => (
          <Card key={installation.id} className="border-border/40 bg-card/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">Стойка {installation.booth}</CardTitle>
                <Badge variant={statusColors[installation.status]} className="shadow-sm">
                  {statusLabels[installation.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pb-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="rounded bg-primary/10 p-1">
                  <Monitor className="h-3.5 w-3.5 text-primary" />
                </div>
                <span>{installation.laptop}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="rounded bg-primary/10 p-1">
                  <Printer className="h-3.5 w-3.5 text-primary" />
                </div>
                <span>{installation.printer}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="rounded bg-muted/50 p-1">
                  <Clock className="h-3.5 w-3.5" />
                </div>
                <span>{installation.time}</span>
              </div>
            </CardContent>
            <CardFooter className="gap-2 pt-3">
              <Button variant="ghost" size="sm" className="flex-1 hover:bg-primary/10 hover:text-primary">
                <Edit className="mr-2 h-4 w-4" />
                Изменить
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => {
                  setSelectedInstallation(installation);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Завершить
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <CreateInstallationDialog
        open={isCreateDialogOpen}
        onClose={onCloseCreateDialog}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Завершить установку?</AlertDialogTitle>
            <AlertDialogDescription>
              Установка {selectedInstallation?.booth} будет помечена как завершенная.
              Оборудование вернется в пул доступного.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Завершить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
